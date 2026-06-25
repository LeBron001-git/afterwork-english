"use client";

import { Check, Copy, ExternalLink, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ShareAccessPanel() {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setOrigin(window.location.origin));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  const dashboardUrl = origin ? `${origin}/dashboard` : "";

  return (
    <section className="card p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted">分享访问</p>
          <h2 className="mt-2 text-2xl font-semibold">让朋友用自己的手机或电脑打开</h2>
          <p className="mt-2 max-w-2xl text-muted">
            同一个 Wi-Fi 下，朋友可以直接访问你电脑的局域网地址。远程朋友则建议部署到 Vercel、Netlify 或自己的服务器。
          </p>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--primary)] text-[var(--primary-foreground)]">
          <Smartphone size={24} />
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4">
          <h3 className="font-semibold">当前打开链接</h3>
          <p className="mt-2 break-all rounded-xl bg-[var(--soft)] p-3 text-sm text-muted">{dashboardUrl || "加载中..."}</p>
          <Button className="mt-3" variant="secondary" disabled={!dashboardUrl} onClick={() => copy(dashboardUrl)}>
            {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "已复制" : "复制链接"}
          </Button>
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4">
          <h3 className="font-semibold">本机分享方式</h3>
          <div className="mt-3 grid gap-2 text-sm text-muted">
            <p>1. 电脑和朋友设备连接同一个 Wi-Fi。</p>
            <p>2. 用局域网地址打开，例如：<code className="rounded bg-[var(--soft)] px-1">http://电脑IP:3000</code></p>
            <p>3. 朋友设备上的学习数据会保存在朋友自己的浏览器里。</p>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-[var(--soft)] p-4 text-sm text-muted">
        远程使用需要上线部署。部署后，把线上网址发给朋友即可；当前版本无后端，朋友之间不会看到彼此的学习记录。
      </div>

      <a href="/dashboard" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)]">
        打开学习首页 <ExternalLink size={15} />
      </a>
    </section>
  );
}
