import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';// Or any other icon library

type FABProps = {onPress?: () => void};

const FloatingActionButton = ({onPress}: FABProps) => {
    return (
        <View className="justify-end items-end">
            <TouchableOpacity
                className={
                    'bg-green-700 w-16 h-16 rounded-full justify-center items-center shadow-lg absolute bottom-6 right-6'
                }
                onPress={onPress}
            >
                <Icon name="add" size={30} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

export default FloatingActionButton;