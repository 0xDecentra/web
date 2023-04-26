import { initCometChat, getMessages, listenForMessage } from "@/services/chat";
import { useEffect } from "react";

export const useCometChat = (safeAddress: string, setMessages: any) => {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    initCometChat()
    async function getM() {
      await getMessages(`pid_${safeAddress!}`)
        .then((msgs: any) => {
          console.log(msgs, 'test 2')
          setMessages(msgs)
        })
        .catch((error) => setMessages(['']))

      await listenForMessage(`pid_${safeAddress!}`)
        .then((msg: any) => {
          setMessages((prevState: any) => [...prevState, msg])
        })
        .catch((error) => console.log(error))
    }
    getM()
  }, [safeAddress])

  return <>{''}</>
}