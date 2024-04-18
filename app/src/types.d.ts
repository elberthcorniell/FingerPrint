import { type FingerprintReader, type SampleFormat, type QualityReported } from '@digitalpersona/devices'

declare global {
    interface Window {
        Fingerprint: {
            WebApi: FingerprintReader
            SampleFormat: SampleFormat
            QualityCode: QualityReported['quality']
        }
    }
}