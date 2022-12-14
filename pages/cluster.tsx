import Link from "next/link";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import Header from "../sections/header";
import { ComputeNameColor, createPlayerLink, dialogue } from "../utils";


const geturl = (uuid: string) => {
    return 'https://raw.githubusercontent.com/rblxacp/ChatArchive.backend/master/src/data/' + uuid;
}

const Cluster = () => {
    const router = useRouter();
    const { uuid } = router.query;
    const [currentUUID, setUUID] = useState<string | undefined>(uuid as string);
    const [dialogue, setDialogue] = useState<dialogue | undefined>();
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        if (uuid === undefined || uuid === null || uuid === "") {
            return;
        }
        setLoading(true);
        setUUID(uuid as string);
        fetch(geturl(uuid as string))
            .then((res) => res.json())
            .then((data) => {
                setDialogue(data);
                setLoading(false);
            })
    }, [uuid])


    return <div className="w-screen">
        <Header branch="cluster" />

        <div className="flex w-screen flex-row justify-center mt-8"> {/* center alignment */}
            <div className="flex flex-col justify-center mx-8"> {/* main container */}
                {
                    (!loading && dialogue)
                        ? <div className={"flex flex-col p-4 rounded-2xl " + (dialogue.pkgversion === "0.0.2" ? "neon" : "")} style={{ maxHeight: "70vh" }}>
                            <h1 className={"text-lg lg:text-3xl font-semibold " + ((loading) ? "text-red-700 font-bold" : "")}> {currentUUID} </h1>
                            <p>Game: <a className="link" href={"https://www.roblox.com/games/" + dialogue.game.toString()}>{dialogue.game}</a></p>
                            <p className={dialogue.pkgversion === "0.0.2" ? "dark:text-amber-600 text-orange-700 font-bold text-lg" : ""}>PKG Version: {dialogue.pkgversion}{dialogue.pkgversion === "0.0.2" ? " PUBLIC BETA!\u{1f973}" : ""}</p>
                            <p>Record Date: {dialogue.date}</p>
                            <p>Owner: {createPlayerLink(dialogue.owner)}</p>
                            <h3>Users:</h3>
                            <ul className="list-decimal list-inside pl-3.5">
                                {dialogue.users.map((v) => {
                                    return <li key={v.userId.toString()}>{createPlayerLink(v)}</li>
                                })}
                            </ul>
                            <br />
                            <div className="overflow-auto scroll flex flex-col justify-start my-4 rounded-3xl bg-gray-200 dark:bg-zinc-800 shadow-xl p-2">
                                {dialogue.data.map((v, i) => {
                                    const val = ComputeNameColor(v.user.name)
                                    return <div key={i} className="font-semibold px-2">
                                        <div className="badge" style={{ backgroundColor: `rgba(${val.r},${val.g},${val.b},0.8)` }}> {createPlayerLink(v.user, "d-link")}  </div><span className="font-extrabold">:</span> {v.message}
                                    </div>
                                })}
                            </div>
                        </div>
                        : <div className="font-mono">
                            This can take up to ten seconds, depending on your Internet connection.
                        </div>
                }
            </div>
        </div>
    </div>
}

export default Cluster
