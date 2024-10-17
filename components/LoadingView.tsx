import { View, Modal, ActivityIndicator } from 'react-native';


type LoadingViewProps = {
    show: boolean;
}

const LoadingView = ({show}: LoadingViewProps) => {

    return (
        <View className={'flex-1 justify-center items-center'}>
            <Modal
                transparent={true}
                animationType="fade"
                visible={show}
            >
                <View className={'flex-1 justify-center items-center bg-transparent'}
                >
                    <View className={'bg-white p-5 border-[1px] border-transparent rounded-2xl items-center'}
                    >
                        <ActivityIndicator size="small" color="darkgreen" />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default LoadingView;