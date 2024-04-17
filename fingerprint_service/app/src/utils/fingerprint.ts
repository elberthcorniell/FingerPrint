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

    call = async (url: string, data: any) => {
            const res = await fetch(url, {
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
    }) => {
            const ENROLLMENT_URL = `${process.env.FP_CLIENT_SERVICE_HOST || 'http://fingerprint_client'}/coreComponents/enroll.php`;
        
            const response = await this.call(ENROLLMENT_URL, preRegisteredFmdArray);
        
            return response;
    }

    verify = async (args: {
        "pre_enrolled_finger_data": string
        "enrolled_index_finger_data": string
        "enrolled_middle_finger_data": string
    }) => {
        const ENROLLMENT_URL = `${process.env.FP_CLIENT_SERVICE_HOST || 'http://fingerprint_client'}/coreComponents/verify.php`;
        console.log(args)
        const response = await this.call(ENROLLMENT_URL, args);
    
        return response;
    }

}

const enrolled = 'APiBAcgq43NcwEE3CatxMOsUVZJMUyvi_8Jcd9q2eNqR37H_5WdPfYNYftt9AnFqpPOrFvVOlrb1wBWF0KJHkChJ7yihGZd6x9M5mpf8H2b0XUZ6p7lQyvINQMlpOewD1aOCIWMpw5yejbWMhqwzy_LclzH9TDMdHwyF_l1cGGfP-J3LA_EgxYrN7byrqso7by8zPCWkXK91xj2tNfYNB-M3n9I7g8wcB6HlMvFxikbniYZDa7_9BJh-8DDa4JiBqfo8xtycc_ljHnl31SoG5YXZJArbdr2xlhWq6TmUG3bupqwUGor9OM3QBNUzsa9T4uf3-i0U7UcwzBXxUFLW-HmupeKOzOZ9dK5ESBihXSuSIJa8O8zKRbvV7E-t4pNADWiTvpUV7qe_5pqyYuR7g5KIKAeqjXrZ11le3IvV21OkvcN6yWUzhg_9oWLN0Mhucltr1WcCNI-FWlQT-GSPjsG_Vp8c8EEoclUx2FdXdMzXWrJyvYJiIX0X1Zawxq94NRvbzAdvAPh_Acgq43NcwEE3Catx8LgUVZIEfLExigrbkYjYamcfed0P3RFrc51TpA0UFA0uKgLext3hGIaF28MEi6fD1TOrmdwcoT8Ls0Md4-boPN95E39OimVyxWheobF7_vKZrx51OUhVe0hTEeEMRZwbS7PE00QLwAJrDH0peGf-cgA7KeLdvFclPn5q9uql_C47HiMstqKfNcWOLWd2y0pk6rid2YKjFGf85xjjX-4Qyojp4DNEIpvj2vRxOantirQPs7zcz0PUIIAlf9E1N-C6MihXzSy8SgA4wf1MCp16uwSnWEPQvNyfpx3g8u7s5rvEyr9pFV29WbOhTnCuBFwLqJM_Y0Td73ut4_kvGiuz4hZKuWSPGG2meQTqFrIHRQVMD2OmV7C6h4fHmsmrbKevdQueIfeFkOLwfI1KEijIiIAjeknc-OdSHH3AbOmno4RTUf2hXGTl0siQ_WuucRdEfBjTENqBKgI7uH4jcBtwoD-6UF7RmfoSjolnmc-m7kyc-YpxbwD4fwHIKuNzXMBBNwmrcfC4FFWSBHyxMYoK25GI2GpnH3ndD90Ra3OdU6QNFBQNLioC3sbd4RiGhdvDBIunw9Uzq5ncHKE_C7NDHePm6DzfeRN_ToplcsVoXqGxe_7yma8edTlIVXtIUxHhDEWcG0uzxNNEC8ACawx9KXhn_nIAOyni3bxXJT5-avbqpfwuOx4jLLainzXFji1ndstKZOq4ndmCoxRn_OcY41_uEMqI6eAzRCKb49r0cTmp7Yq0D7O83M9D1CCAJX_RNTfgujIoV80svEoAOMH9TAqdersEp1hD0Lzcn6cd4PLu7Oa7xMq_aRVdvVmzoU5wrgRcC6iTP2NE3e97reP5Lxors-IWSrlkjxhtpnkE6hayB0UFTA9jplewuoeHx5rJq2ynr3ULniH3hZDi8HyNShIoyIiAI3pJ3PjnUhx9wGzpp6OEU1H9oVxk5dLIkP1rrnEXRHwY0xDagSoCO7h-I3AbcKA_ulBe0Zn6Eo6JZ5nPpu5MnPmKcW8A6IAByCrjc1zAQTcJq3Gw6hRVkjip8v8xG1c9u9QxM5HaZiaTniTClFCyt2fPlhyB5NDmcyBX5fshCMOCGj1BGmCou7DGiwHf44CDuHVPNcy5bIcXTHc4y6IOKau6RDBaXVm6cMphFEdg8YGldlaGi0gU0dPr3WVgN5VQQQOIg_DvzyIuPNnD-eUepyByeDD70AWMrO9lyEpTHziFuFYM4xXgT4EXQdBXOg7TdDjHCorOYA6DgjRMGEO31vubklpvc_2FZAQEVHljF1hc7W8P54QFWR3pWL7NILMcmIm-AblujmlT7fUw-TtqubfZvT3jG6RPgvk-YMKypR8t4YYk_rGVVX_ebl897FOmZZINEDpwLur27UE7P0uX1PFDwKxZgITwjsI82jGHlT8_0wF_wzXYbsNp5BWyujnoxnLP6UMgIf93wEuIwf2f6xOzMPg9iMSVj7RRvHa3NJQ9BGLtvqSh7eiP8As5iR0etjVGc5m46UXrRM_YCOiLIMnFSjJIWXE7b6VvfwAAb7f9sJ9VAABIMwGIb38AAJgOAYhvfwAA4HVzpW9_AACwDgGIb38AAOB1c6VvfwAAr6IRsZ9VAABIMwGIb38AAJgOAYhvfwAA8BIBiG9_AAA'

export const fingerprint = new Fingerprint()
