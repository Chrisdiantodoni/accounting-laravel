import Carousel from "../Carousel";
import Icons from "../Icon";
import Modal from "../Modal";
import pdfPreview from "@/assets/images/pdf-preview.png";
import { SwiperSlide } from "swiper/react";

const ModalUrlFile = ({ item }) => {
    const pdfOpeninNewTab = (url) => {
        window.open(url, "_blank"); // Open the PDF file in a new tab
    };
    return (
        <Modal
            uncontrol={true}
            centered={true}
            title="File"
            label={
                <Icons
                    icon={"mdi:eye"}
                    width={20}
                    className={
                        "btn-outline-primary border-transparent rounded-md hover:border-transparent hover:text-blue-500"
                    }
                />
            }
        >
            {/* {JSON.stringify(item)} */}
            {/* <SwiperSlide>
                <div
                    className="single-slide bg-no-repeat bg-cover bg-center rounded-md min-h-[300px] "
                    style={{
                        backgroundImage: `url(${c1})`,
                    }}
                ></div>
            </SwiperSlide> */}
            <Carousel pagination={true} navigation={true} className="main-caro">
                {item?.map((file, index) => (
                    <SwiperSlide>
                        <div
                            className={`rounded-md ${
                                !file?.image?.endsWith(".pdf")
                                    ? ""
                                    : "hover:bg-opacity-50  bg-slate-50 cursor-pointer transition-opacity duration-150"
                            }`}
                        >
                            <div
                                key={index}
                                onClick={() =>
                                    !file?.image?.endsWith(".pdf")
                                        ? {}
                                        : pdfOpeninNewTab(file?.image)
                                }
                                className={`single-slide bg-contain bg-no-repeat bg-center rounded-md min-h-[300px] `}
                                style={{
                                    backgroundImage: `url(${
                                        !file?.image?.endsWith(".pdf")
                                            ? file.image
                                            : pdfPreview
                                    })`,
                                }}
                            ></div>
                        </div>
                    </SwiperSlide>
                ))}
            </Carousel>
        </Modal>
    );
};

export default ModalUrlFile;
