import * as React from 'react';
import { Appbar } from 'react-native-paper';

const TaskAppbar = () => (
    <Appbar.Header className="bg-green-200">
        <Appbar.Content title="Task Manager" />
    </Appbar.Header>
);

export default TaskAppbar;