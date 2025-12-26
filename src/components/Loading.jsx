import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode, faMessage } from "@fortawesome/free-solid-svg-icons";

export default function Loading()
{
    return (
        <div className="h-[100vh] flex justify-center items-center">
            <FontAwesomeIcon icon={faMessage} className="text-muted dark:text-text-dark text-9xl font-extrabold animate-pulse" />
        </div>
    );
}