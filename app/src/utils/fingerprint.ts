export class Hand{
    id: number
    index_finger: string[] = []
    middle_finger: string[] = []

    constructor({ userId }: { userId: number }) {
        this.id = userId
    }

    addIndexFingerSample(sample: string){
        this.index_finger.push(sample);
    }

    addMiddleFingerSample(sample: string){
        this.middle_finger.push(sample);
    }

    generateFullHand(){
        let id = this.id;
        let index_finger = this.index_finger.map(i => JSON.parse(i)[0]?.Data);
        let middle_finger = this.index_finger.map(i => JSON.parse(i)[0]?.Data);
        return JSON.stringify({ id, index_finger, middle_finger });
    }
}

class Fingerprint {

    call = async (path: string, data: any) => {
            const res = await fetch(`${process.env.FP_CLIENT_SERVICE_HOST || 'http://fingerprint_client'}${path}`, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            return await res.json();
    }
    
    enroll = async (preRegisteredFmdArray: {
        index_finger: string[],
        middle_finger: string[]
    }) => this.call(`/coreComponents/enroll.php`, preRegisteredFmdArray);

    verify = async (args: {
        "pre_enrolled_finger_data": string
        "enrolled_index_finger_data": string
        "enrolled_middle_finger_data": string
    }) => this.call(`/coreComponents/verify.php`, args);

}

export const fingerprint = new Fingerprint()
