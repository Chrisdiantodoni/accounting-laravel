import { create } from "zustand";

const initialState = {
    modal: {
        modalAddUser: false,
        modalChangePassword: false,
        modalChangePasswordAuthenticated: false,
        modalAddLocation: false,
        modalParentAccount: false,
        modalChildAccount: false,
        modalCoa: false,
        modalLedgers: false,
    },
    permissionUser: [],
    pageTitle: "",
    users: {},
};

const createStore = create((set) => ({
    ...initialState,
    setTitle: (name) =>
        set((state) => ({
            ...state,
            pageTitle: name,
        })),
    handle: (name, value) => {
        set((state) => ({
            ...state,
            [name]: value,
        }));
    },
    handleModal: (name, value, items, type) =>
        set((state) => ({
            ...state,
            modal: {
                ...state.modal,
                [name]: value,
            },
            modalItem: items,
            typeModal: type != undefined ? type : state.typeModal,
        })),
}));

export default createStore;
