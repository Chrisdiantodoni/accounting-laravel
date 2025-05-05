import Carousel from "../Carousel";
import Modal from "../Modal";

const ModalUrlFile = ({ item }) => {
    return (
        <Modal uncontrol={true}>
            {JSON.stringify(item)}
            <div className="grid grid-cols-2">
                <Carousel
                    pagination={true}
                    navigation={true}
                    className="main-caro"
                ></Carousel>
            </div>
        </Modal>
    );
};

export default ModalUrlFile;
