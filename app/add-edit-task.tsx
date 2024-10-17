import {View, Text, SafeAreaView, TouchableOpacity} from "react-native";
import AppTextInput from "@/components/AppTextInput";
import {Task} from "@/app/index";
import {creatTask, updateTask} from "@/data/api";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useLocalSearchParams, useRouter} from "expo-router";
import {useEffect, useState} from "react";
import LoadingView from "@/components/LoadingView";
import {Snackbar} from "react-native-paper";

export default function AddEditTask() {

    const queryClient = useQueryClient();
    const router = useRouter();
    const {id, name, description, isEditMode} = useLocalSearchParams();

    const [taskName, setTaskName] = useState<string>(name as string);
    const [taskDescription, setTaskDescription] = useState<string>(description as string);

    function generateUniqueId(): number {
        return Date.now();
    }

    const addTask = async (task: Task): Promise<Task[] | any> => {
        const response = await creatTask(`http://localhost:3001/taskmanager/api/tasks`, task)
        const json = await response.json()
        console.log(json)
        return await json
    }

    const {isPending, mutate, isSuccess} = useMutation({
        mutationFn: addTask,
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({queryKey: ['tasks']})
        },
    })


    const updateTaskDetails = async (task: Task): Promise<Task[] | any> => {
        const response = await updateTask(`http://localhost:3001/taskmanager/api/tasks/${task.id.toString()}`, task)
        const json = await response.json()
        console.log(json)
        return await json
    }

    const {mutate: updateMutate, isPending: isTaskUpdatePending, isSuccess: isTaskUpdateSuccessful} = useMutation({
        mutationFn: updateTaskDetails,
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({queryKey: ['tasks']})
        },
    })
    useEffect(() => {
        if (isSuccess || isTaskUpdateSuccessful) {
            router.back();
        }
    }, [isSuccess, isTaskUpdateSuccessful]);

    return (
        <SafeAreaView className={'flex-1 pl-4 bg-white'}>
            <AppTextInput
                value={taskName as string}
                styling={'mx-4 mt-4 mb-4'}
                onTextChange={(value) => {
                    setTaskName(value)
                }}
                label={'Title'}></AppTextInput>

            <AppTextInput
                value={taskDescription as string}
                styling={'mx-4'}
                onTextChange={(value) => {
                    setTaskDescription(value)
                }}
                multiline={true}
                textFieldStyle={'h-20'}
                label={'Description'}></AppTextInput>

            <View className={'flex-row mx-4 mt-4 rounded-[6px] bg-green-700'}>
                <TouchableOpacity
                    disabled={(taskName === '' || taskDescription === '')}
                    className={'w-full h-10 justify-center items-center'} onPress={
                    () => {
                        if (isEditMode === '0') {
                            // false
                            const newTask = {
                                id: generateUniqueId(),
                                name: taskName,
                                description: taskDescription,
                                completed: false,
                            } as Task
                            mutate(newTask)
                        } else {
                            //updateTask
                            const updateTask = {
                                id: Number(id as string),
                                name: taskName,
                                description: taskDescription,
                                completed: false
                            } as Task
                            updateMutate(updateTask)
                        }
                    }}>
                    <Text className={'text-white'}>{isEditMode === '1' ? 'Update Task' : 'Add Task'}</Text>
                </TouchableOpacity>
            </View>
            <LoadingView show={isPending || isTaskUpdatePending}/>
            <Snackbar visible={isTaskUpdateSuccessful || isSuccess} onDismiss={() => {
            }}>
                {isSuccess ? 'Task Added' : 'Task Updated'}

            </Snackbar>
        </SafeAreaView>
    )

}