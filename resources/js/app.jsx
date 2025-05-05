import "./bootstrap";
import "../css/app.css";
import "simplebar-react/dist/simplebar.min.css";
import "flatpickr/dist/themes/light.css";
import "react-toastify/dist/ReactToastify.css";
import "../assets/scss/app.scss";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const pages = import.meta.glob("./pages/**/*.jsx", { eager: true });
        let page = pages[`./pages/${name}.jsx`];
        page.default.layout = name.startsWith("Dashboard/")
            ? (page) => <Layout children={page} />
            : undefined;
        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <QueryClientProvider client={queryClient}>
                <Provider store={store}>
                    <BrowserRouter>
                        <App {...props} />
                    </BrowserRouter>
                </Provider>
            </QueryClientProvider>
        );
    },
    // progress: false,
    progress: {
        // delay: 150,

        color: "#D40000",

        includeCSS: true,

        showSpinner: true,
    },
    // ...
});
