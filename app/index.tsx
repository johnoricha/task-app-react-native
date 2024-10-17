import {
    View,
    Text,
    ActivityIndicator,
    Platform,
    TouchableOpacity, TouchableHighlight
} from "react-native";
import TaskItem from "@/components/TaskItem";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {deleteTask, fetchTasks} from "@/data/api";
import {useRouter} from "expo-router";
import FloatingActionButton from "@/components/Fab";
import {SwipeListView} from "react-native-swipe-list-view";
import Icon from "react-native-vector-icons/MaterialIcons";
import Toast from 'react-native-root-toast';
import {useEffect} from "react";
import RootSiblings from "react-native-root-siblings/src/RootSiblings";

const BASE_URL = Platform.OS === 'android' ? "http://10.0.2.2:3001/taskmanager/api" : 'http://localhost:3001/taskmanager/api';

export interface Task {
    id: number;
    name: string;
    description: string;
    completed: boolean;
}

export default function Index() {

    const router = useRouter();
    const queryClient = useQueryClient();


    const deleteTaskItem = async (task: Task) => {
        await new Promise(resolve => setTimeout(resolve, 3000));
        const response = await deleteTask(`${BASE_URL}/tasks/${task.id}`);
        const json = await response.json()
        console.log(json)
        return await json
    }
    const {mutate: deleteMutation, status: deleteStatus} = useMutation({
        mutationFn: deleteTaskItem,
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({queryKey: ['tasks']})
        },
    })

    const getTasks = async () => {
        await new Promise(resolve => setTimeout(resolve, 3000));
        const response = await fetchTasks(`${BASE_URL}/tasks`)
        const json = await response.json()
        console.log(json)
        return await json
    }

    const {data, status, error} = useQuery({queryKey: ['tasks'], queryFn: getTasks});

    useEffect(() => {
        let deletingToast;
        if (deleteStatus === "pending") {
            deletingToast = Toast.show('Deleting task...', {
                duration: Toast.durations.SHORT,
            });
        }

        if (deleteStatus === "success") {
            if (deletingToast) {
                Toast.hide(deletingToast as RootSiblings)
            }
            Toast.show('Task deleted.', {
                duration: Toast.durations.LONG,
            });
        }
    }, [deleteStatus])

    return (
        <View className={'flex-1 bg-white'}>
            <View className="flex-col justify-center items-center flex-1 bg-white">
                {status === 'pending' &&
                    <ActivityIndicator/>}
                {(status === 'success' && (data as Task[]).length !== 0) &&
                    <SwipeListView
                        className={''}
                        keyExtractor={(item: Task) => item.id.toString()}
                        contentContainerStyle={{paddingStart: 16, paddingEnd: 16, paddingBottom: 80}}
                        data={data}
                        renderItem={(rowData: { item: Task }, rowMap) => {
                            return <TouchableHighlight
                                underlayColor={'transparent'}
                                onPress={() => {
                                    router.push({
                                        pathname: `/add-edit-task`, params: {
                                            id: rowData.item.id,
                                            name: rowData.item.name,
                                            description: rowData.item.description,
                                            isEditMode: '1' // true
                                        }
                                    })
                                }}
                            >
                                <TaskItem key={rowData.item.id} task={rowData.item}/>
                            </TouchableHighlight>
                        }
                        }
                        renderHiddenItem={(data, rowMap) => (
                            <TouchableOpacity onPress={() => {
                                deleteMutation(data.item)
                                if (rowMap[data.item.id]) {
                                    rowMap[data.item.id].closeRow(); // Manually close the row after deleting
                                }

                            }}>
                                <View className={'bg-green py-4 justify-center h-24'}>
                                    <Icon name="delete" size={30} color={'red'}/>
                                </View>
                            </TouchableOpacity>
                        )}
                        disableLeftSwipe={true}
                        leftActionValue={0}
                        leftOpenValue={100}
                        // // onSwipeValueChange={(swipeData) => {
                        // //     const {key, value} = swipeData;
                        // //     console.log('swiping..')
                        // //
                        // //     const task = (data as Task[]).find((item) => item.id.toString() === key)
                        // //     if (value === 100) {
                        // //         if (task) {
                        // //             mRowMap[task?.id].closeRow()
                        // //             console.log('deleting... swipeValue: ', value)
                        // //             // deleteMutation(task)
                        // //         }
                        // //     }
                        // // }
                        // }

                    />}
                {status === 'error' && <Text>{error.message}</Text>}
                {(data && (data as Task[]).length === 0) && <Text>No Tasks</Text>}
            </View>
            <FloatingActionButton onPress={() => {
                router.push({
                    pathname: '/add-edit-task', params: {
                        isEditMode: '0' // false
                    }
                });
            }}/>
        </View>
    );
}
