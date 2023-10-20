import Image from "next/image";
import Link from "next/link";
import Header from "./components/header/Header";


const notFound = () => {
    return (
        <div>
            <Header />
            <div className="w-full lg:mt-[13rem] max-md:mt-[13rem] flex flex-col items-center justify-center max-md:w-[95%] mx-auto">
                <div className="border flex flex-col items-center justify-center gap-5 text-center border-[#f8f8f8] rounded-3xl p-10">
                    <Image src={'/images/404.png'} alt="404" width={100} height={100} />
                    <h1 className="font-bold text-[18px]">
                        Stranica koju tražite ne postoji ili je premeštena.
                    </h1>
                    <h2 className="font-normal text-[15px] mt-3">
                        Proverite da li ste uneli ispravan URL.
                    </h2>
                    <Link href="/">
                        <button className="bg-[#2bc48a] mt-5 px-10 font-medium text-white hover:bg-opacity-80 py-4">
                            Vrati se na početnu stranu
                        </button>
                    </Link>
                </div>
            </div>
        </div>

    );
};

export default notFound;
