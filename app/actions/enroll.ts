"use server";

import { fingerprint } from "@/src/utils/fingerprint";

export const enroll = async (_data: string) => {

    const data = JSON.parse(_data);
    const id = data.id
    const indexStringArray = [...data.index_finger, data.index_finger[0]]
    const middleStringArray = indexStringArray

    const preRegisteredFmdArray = {
        "index_finger": indexStringArray,
        "middle_finger": middleStringArray
    }

    // if (isDuplicate($index_finger_string_array[0]) || isDuplicate($middle_finger_string_array[0])) {
    //     echo "Duplicate not allowed!";
    // }
    const response = await fingerprint.enroll(preRegisteredFmdArray)
    return response
}
