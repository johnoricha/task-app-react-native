import {Task} from "@/app";

export function fetchTasks(url: string) {

    return fetch(url,  {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });
}

export function deleteTask(url: string) {

    return fetch(url,  {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    });
}

export function updateTask(url: string, task: Task) {

    return fetch(url,  {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...task,
        })
    });
}


export function creatTask(url: string, task: Task) {

    return fetch(url,  {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...task,
        })
    });
}
