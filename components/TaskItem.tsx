import {View, Text} from "react-native";
import {Task} from "@/app";
import Checkbox from "expo-checkbox";
import {useEffect, useState} from "react";
import {updateTask} from "@/data/api";
import {useMutation, useQueryClient} from "@tanstack/react-query";

type TaskItemProps = {
    task: Task;
}

export default function TaskItem({task}: TaskItemProps) {


    const [checked, setChecked] = useState<boolean>(false);

    const queryClient = useQueryClient()

    useEffect(() => {
        setChecked(task.completed)
    }, [])

    const updateTaskItem = async (task: Task): Promise<Task[] | any> => {
        const response = await updateTask(`http://localhost:3001/taskmanager/api/tasks/${task.id}`, task)
        const json = await response.json()
        console.log(json)
        return await json
    }

    const mutation = useMutation({
        mutationFn: updateTaskItem,
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['updateTask'] })
        },})



    return (
        <View
            className="flex-row items-center px-5 justify-between rounded-2xl my-2 py-4 bg-green-50 shadow-black shadow-sm w-full h-20">
            <View className="flex-col">
                <Text className="text-red-500">{task.name}</Text>
                <Text>{task.description}</Text>
            </View>
            <Checkbox
                className={'rounded-[6px]'} color={'darkgreen'}
                disabled={false} value={checked}
                onValueChange={(checked) => {
                          setChecked(checked)
                          const updatedTask = {...task, completed: checked}
                          mutation.mutate(updatedTask)}
                }
            />
        </View>
    )
}