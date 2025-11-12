"use client";
import { useState, useRef, useEffect } from "react";
import { User, Bot, Copy, ArrowUpIcon, HandCoins } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import {
  InputGroupTextarea,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { message } from "@/components/ui/toast";
type Message = {
  id: string;
  role: "user" | "bot";
  text: string;
};

export default function ChatPage() {
  const [list, setList] = useState<Message[]>([
    {
      id: Date.now().toString(),
      role: "bot",
      text: "你好呀！我是MCP的工具助手，很高兴为你服务！有什么可以帮你的吗？不管是问题还是闲聊，我都在这里哦～ 😊",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    if (bodyRef.current) {
      // 使用 setTimeout 确保 DOM 更新后再滚动
      setTimeout(() => {
        bodyRef.current?.scrollTo({
          top: bodyRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  }, [list, loading]);

  const [value, setValue] = useState("");
  const [tag, setTag] = useState(false);
  const [tip, setTip] = useState("请先输入内容");
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val) {
      setTag(true);
      setTip("发送");
    } else {
      setTag(false);
      setTip("请先输入内容");
    }
    setValue(val);
  };

  const sendClick = async () => {
    // 防止发送空内容
    if (!value.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: value.trim(),
    };
    setList((prev) => [...prev, userMsg]);
    setLoading(true);
    setTip("发送");
    const messageToSend = value.trim();
    setValue("");
    setTag(false);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_POSTGRES_URL}/v1/process`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: messageToSend }),
        }
      ).then((r) => r.json());
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: res.message,
      };
      setList((prev) => [...prev, botMsg]);
    } catch {
      const errMsg: Message = {
        id: (Date.now() + 2).toString(),
        role: "bot",
        text: "服务异常，请重试",
      };
      setList((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
      setTip("请先输入内容");
    }
  };

  const handlePressEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !loading) {
        sendClick();
      }
    }
  };
  const copyClick = async (text: string) => {
    const errText = "当前环境不支持复制，请手动选择文本复制。";
    const sucText = "已复制到剪贴板";
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        message.success(sucText);
        return;
      }
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textarea);
      if (successful) {
        message.success(sucText);
      } else {
        throw new Error(errText);
      }
    } catch {
      message.error(errText);
    }
  };

  return (
    <div className="flex flex-col h-full p-2">
      {/* 消息体 */}
      <main
        ref={bodyRef}
        className="flex-1 overflow-y-scroll bg-muted/50 p-2 rounded-lg h-[80vh]"
      >
        {list.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20 text-muted-foreground">
            <HandCoins size={50} />
            <p className="text-sm mt-2">暂无消息</p>
          </div>
        )}
        <div className="space-y-3 max-h-[80vh] ">
          {list.map(({ id, role, text }) => (
            <div key={id} className="flex items-start mb-3">
              {role === "user" ? (
                <div className="ml-auto flex gap-2 max-w-[70%] items-center relative group cursor-pointer">
                  <div className="flex-1 bg-primary text-primary-foreground rounded-xl px-3 py-2 break-words overflow-hidden cursor-pointer">
                    <div className="cursor-text"> {text}</div>
                  </div>
                  <div
                    className="flex items-center justify-end gap-2 text-sm text-muted-foreground absolute -bottom-6 right-10 opacity-0 group-hover:opacity-100 w-[50px]"
                    onClick={() => copyClick(text)}
                  >
                    <Copy size={12} />
                    <p>复制</p>
                  </div>
                  <User />
                </div>
              ) : (
                <div className="flex items-start gap-2 max-w-[70%] relative group cursor-pointer">
                  <Bot className="mt-1"/>
                  <div className="flex-1 bg-card border border-border rounded-xl px-3 py-2 break-words overflow-hidden">
                    <div className="cursor-text"> {text}</div>
                  </div>
                  <div
                    className="flex items-center gap-2 text-sm text-muted-foreground absolute -bottom-6 left-10 opacity-0 group-hover:opacity-100 w-[50px]"
                    onClick={() => copyClick(text)}
                  >
                    <Copy size={12} /> <p>复制</p>
                  </div>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-muted-foreground py-2">
              <Spinner /> 正在输入...
            </div>
          )}
        </div>
      </main>
      {/* 底部输入 */}
      <footer className="bg-background pt-2 ">
        <div className="h-[100px] w-full px-2 border border-border rounded-lg flex items-center">
          <InputGroupTextarea
            value={value}
            onChange={handleChange}
            placeholder="尽管问……"
            onKeyDown={handlePressEnter}
            className="h-[90px]"
            readOnly={loading}
          />
          <InputGroupAddon align="block-end" className="w-[30px]">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <InputGroupButton
                    variant="outline"
                    className="rounded-full"
                    size="icon-sm"
                    onClick={sendClick}
                    disabled={!tag || loading}
                  >
                    {loading ? <Spinner /> : <ArrowUpIcon />}
                  </InputGroupButton>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{loading ? "发送" : tip}</p>
              </TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </div>
      </footer>
    </div>
  );
}
