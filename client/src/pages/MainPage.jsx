
import MainPageProvider from "../utils/MainPageContext";
import Roomlist from "./Roomlist";

const MainPage = () => {
    return (
        <MainPageProvider>
            <Roomlist />   
        </MainPageProvider>
    );
}

export default MainPage;
