import {router, Stack, useLocalSearchParams} from "expo-router";
import {Text, TouchableOpacity} from "react-native"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {RootSiblingParent} from "react-native-root-siblings";

const queryClient = new QueryClient();

export default function RootLayout() {
    const {isEditMode} = useLocalSearchParams()

    console.log('isEditMode: ', isEditMode)

    return (
        <QueryClientProvider client={queryClient}>
            <RootSiblingParent>
                <Stack>
                    <Stack.Screen name="index" options={{
                        headerStyle: {
                            backgroundColor: '#BBF7D0'
                        },
                        headerTitle: () => <Text className={'text-[22px]'}>Task Manager</Text>,
                    }}/>
                    <Stack.Screen name="add-edit-task" options={{
                        headerShown: true,
                        headerStyle: {
                            backgroundColor: '#BBF7D0'
                        },
                        headerTitle: () => <Text className={'text-[20px]'}>Add Task</Text>,
                        headerLeft: () => <TouchableOpacity onPress={
                            () => {
                                router.back()
                            }
                        }><Text>Back</Text></TouchableOpacity>
                    }}
                    />
                </Stack>
            </RootSiblingParent>
        </QueryClientProvider>
    );
}
