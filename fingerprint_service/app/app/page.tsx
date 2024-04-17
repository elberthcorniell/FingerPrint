"use client"

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { type FingerprintReader, type SamplesAcquired } from '@digitalpersona/devices';
import { type BioSample } from "@digitalpersona/core";
import { Hand } from "@/src/utils/fingerprint";
import { enroll } from "@/actions/enroll";
import { verify } from "@/actions/verify";

const ifExists = (fn: () => void) => (typeof fn !== 'undefined') ? fn : () => {}

export default function Home() {
  const [devices, setDevices] = useState<string[]>([])
  const [selectedDevice, setSelectedDevice] = useState<string>()
  const reader = useRef<FingerprintReader>()
  const [samples, setSamples] = useState<SamplesAcquired['samples'][]>([])
  const [isConnected, setIsConnected] = useState(false)
  const hand = useRef(new Hand({
    userId: 1
  }))
  const [activeModal, setActiveModal] = useState<'verify' | 'enroll'>()

  useEffect(() => {
    setTimeout(async () => {
      if(!window.Fingerprint) return
      // @ts-expect-error
      reader.current = new window.Fingerprint.WebApi
      if(!reader.current) return 

      const devices = await reader.current.enumerateDevices()
      setDevices(devices)
      if(!selectedDevice) return
      const data = await reader.current.getDeviceInfo(selectedDevice)
      reader.current.onDeviceConnected = function (e) {
        // Detects if the device is connected for which acquisition started
        setIsConnected(true)
    };
    reader.current.onDeviceDisconnected = function (e) {
        // Detects if device gets disconnected - provides deviceUid of disconnected device
        console.log("Device is Disconnected. Please Connect Back");
    };
    reader.current.onCommunicationFailed = function (e) {
        // Detects if there is a failure in communicating with U.R.U web SDK
        console.log("Communication Failed. Please Reconnect Device")
    };
    reader.current.onSamplesAcquired = async function (s) {
        // @ts-expect-error
        if(s.deviceUid === selectedDevice) {
          setSamples(samples => [s.samples, ...samples])
          hand.current.addIndexFingerSample(s.samples as unknown as string)
          const parsed: BioSample[] = JSON.parse(s.samples as unknown as string)
          if(activeModal === 'verify') {
            const res = await verify(parsed[0]?.Data)
            if(res === 'match') alert('Verificado')
              else alert("No hay coincidencias")
          }
          parsed.map(p => {
            console.log(p)
          })
        } else {
          console.log("sampleNotFromSelected")
        }
    };
    reader.current.onQualityReported = function (e) {
      // @ts-expect-error
      const quality = window.Fingerprint.QualityCode[e.quality];
    }
      // @ts-expect-error
      reader.current.startAcquisition(window.Fingerprint.SampleFormat.Intermediate, "").then(console.log)
    }, 2000)
  }, [selectedDevice, activeModal])

  return (<>
    <Script strategy="afterInteractive" src="/js/jquery-3.5.0.min.js" />
    <Script strategy="afterInteractive" src="/js/bootstrap.bundle.js" />
    <Script strategy="afterInteractive" src="/js/es6-shim.js" />
    <Script strategy="afterInteractive" src="/js/websdk.client.bundle.min.js" />
    <Script strategy="afterInteractive" src="/js/fingerprint.sdk.min.js" />
    <Script strategy="afterInteractive" src="/js/custom.js" />

    <div className="container">
      <div id="controls" className="row justify-content-center mx-5 mx-sm-0 mx-lg-5">
        <div className="col-sm mb-2 ml-sm-5">
          <button id="createEnrollmentButton" type="button" className="btn btn-primary btn-block" data-toggle="modal" data-target="#createEnrollment" onClick={() => setActiveModal('enroll')}>Create Enrollment</button>
        </div>
        <div className="col-sm mb-2 mr-sm-5">
          <button id="verifyIdentityButton" type="button" className="btn btn-primary btn-block" data-toggle="modal" data-target="#verifyIdentity" onClick={() => setActiveModal('verify')}>Verify Identity</button>
        </div>
      </div>
    </div>

    <section>
      <div className="modal fade" id="createEnrollment" data-backdrop="static" tabIndex={-1} aria-labelledby="createEnrollmentTitle" aria-hidden="true">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title my-text my-pri-color" id="createEnrollmentTitle">Create Enrollment</h3>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => reader.current?.stopAcquisition}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div id="status"></div>
            <div className="modal-body">
              <form action="#" onSubmit={(e) => {
                e.preventDefault()
                enroll(hand.current.generateFullHand())
              }}>
                <div id="enrollmentStatusField" className="text-center">
                </div>
                <div className="form-row mt-3">
                  <div className="col mb-3 mb-md-0 text-center">
                    <label htmlFor="enrollReaderSelect" className="my-text7 my-pri-color">Choose Fingerprint Reader</label>
                    <select
                    defaultValue={"Select Fingerprint Reader"}
                    name="readerSelect" id="enrollReaderSelect" value={selectedDevice} className="form-control" onChange={({ target: { value}}) => {
                      setSelectedDevice(value)
                    }}>
                      <option>Select Fingerprint Reader</option>
                      {devices.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row mt-2">
                  <div className="col mb-3 mb-md-0 text-center">
                    <label htmlFor="userID" className="my-text7 my-pri-color">Specify UserID</label>
                    <input id="userID" type="text" className="form-control" required />
                  </div>
                </div>
                <div className="form-row mt-1">
                  <div className="col text-center">
                    <p className="my-text7 my-pri-color mt-3">Capture Index Finger</p>
                  </div>
                </div>
                {isConnected && <p>Dispositivo conectado</p>}
                <div id="indexFingers" className="form-row justify-content-center">
                  <div id="indexfinger1" className="col mb-3 mb-md-0 text-center">
                    <span className={`icon ${samples.length >= 1 ? "icon-indexfinger-enrolled" : "icon-indexfinger-not-enrolled" }  `} />
                  </div>
                  <div id="indexfinger2" className="col mb-3 mb-md-0 text-center">
                    <span className={`icon ${samples.length >= 2 ? "icon-indexfinger-enrolled" : "icon-indexfinger-not-enrolled" }  `} />
                  </div>
                  <div id="indexfinger3" className="col mb-3 mb-md-0 text-center">
                    <span className={`icon ${samples.length >= 3 ? "icon-indexfinger-enrolled" : "icon-indexfinger-not-enrolled" }  `} />
                  </div>
                </div>
                <div className="form-row m-3 mt-md-5 justify-content-center">
                  <div className="col-4">
                    <button className="btn btn-primary btn-block my-sec-bg my-text-button py-1" type="submit">Enroll</button>
                  </div>
                  <div className="col-4">
                    <button className="btn btn-secondary btn-outline-warning btn-block my-text-button py-1 border-0" type="button" onClick={() => reader.current?.stopAcquisition}>Clear</button>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <div className="form-row">
                <div className="col">
                  <button className="btn btn-secondary my-text8 btn-outline-danger border-0" type="button" data-dismiss="modal" onClick={() => reader.current?.stopAcquisition}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div id="verifyIdentity" className="modal fade" data-backdrop="static" tabIndex={-1} aria-labelledby="verifyIdentityTitle" aria-hidden="true">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title my-text my-pri-color" id="verifyIdentityTitle">Identity Verification</h3>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => reader.current?.stopAcquisition}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form action="#" onSubmit={() => false}>
                <div id="verifyIdentityStatusField" className="text-center">
                </div>
                <div className="form-row mt-3">
                  <div className="col mb-3 mb-md-0 text-center">
                    <label htmlFor="verifyReaderSelect" className="my-text7 my-pri-color">Choose Fingerprint Reader</label>
                    <select
                    defaultValue={"Select Fingerprint Reader"}
                    name="readerSelect" id="enrollReaderSelect" value={selectedDevice} className="form-control" onChange={({ target: { value}}) => {
                      setSelectedDevice(value)
                    }}>
                      <option>Select Fingerprint Reader</option>
                      {devices.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row mt-4">
                  <div className="col mb-md-0 text-center">
                    <label htmlFor="userIDVerify" className="my-text7 my-pri-color m-0">Specify UserID</label>
                    <input type="text" id="userIDVerify" className="form-control mt-1" required />
                  </div>
                </div>
                <div className="form-row mt-3">
                  <div className="col text-center">
                    <p className="my-text7 my-pri-color mt-1">Capture Verification Finger</p>
                  </div>
                </div>
                <div id="verificationFingers" className="form-row justify-content-center">
                  <div id="verificationFinger" className="col mb-md-0 text-center">
                    <span className="icon icon-indexfinger-not-enrolled" title="not_enrolled"></span>
                  </div>
                </div>
                <div className="form-row mt-3" id="userDetails">
                </div>
                <div className="form-row m-3 mt-md-5 justify-content-center">
                  <div className="col-4">
                    <button className="btn btn-primary btn-block my-sec-bg my-text-button py-1" type="submit" onClick={ifExists(window.captureForIdentify)}>Start Capture</button>
                  </div>
                  <div className="col-4">
                    <button className="btn btn-secondary btn-outline-warning btn-block my-text-button py-1 border-0" type="button" onClick={() => reader.current?.stopAcquisition}>Clear</button>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <div className="form-row">
                <div className="col">
                  <button className="btn btn-secondary my-text8 btn-outline-danger border-0" type="button" data-dismiss="modal" onClick={() => reader.current?.stopAcquisition}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
  );
}
