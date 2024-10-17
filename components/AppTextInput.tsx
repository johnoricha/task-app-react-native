import {TextInput, Text, View,} from "react-native";
type AppTextInputProps = {
    label: string;
    styling?: string;
    multiline?: boolean;
    textFieldStyle?: string;
    onTextChange: (text: string) => void;
    value: string;
}


export default function AppTextInput({label, value, styling, multiline, textFieldStyle, onTextChange }: AppTextInputProps) {
    return (
        <View className={`${styling}`}>
            <Text className={'text-[20px]'}>{label}</Text>
            <TextInput
                selectionColor='darkgreen'
                multiline={multiline}
                value={value}
                className={`w-full p-2 h-10 border-green-200 border-2 rounded-[6px] ${textFieldStyle}`}
                onChangeText={(value) => {
                    onTextChange(value)
                }}
            ></TextInput>
        </View>
    )
}