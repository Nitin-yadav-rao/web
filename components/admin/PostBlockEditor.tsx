"use client";

import type { PostBlock } from "@/types";
import { AdminButton, Input, Textarea } from "@/components/admin/ui";

const BLOCK_TYPES: PostBlock["type"][] = ["paragraph", "heading", "quote", "callout"];

function emptyBlock(type: PostBlock["type"]): PostBlock {
  if (type === "callout") return { type: "callout", label: "", text: "" };
  return { type, text: "" };
}

export function PostBlockEditor({
  blocks,
  onChange,
}: {
  blocks: PostBlock[];
  onChange: (blocks: PostBlock[]) => void;
}) {
  function updateBlock(index: number, patch: Partial<PostBlock>) {
    onChange(blocks.map((b, i) => (i === index ? ({ ...b, ...patch } as PostBlock) : b)));
  }

  function changeType(index: number, type: PostBlock["type"]) {
    onChange(blocks.map((b, i) => (i === index ? emptyBlock(type) : b)));
  }

  function remove(index: number) {
    onChange(blocks.filter((_, i) => i !== index));
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= blocks.length) return;
    const a = blocks[index];
    const b = blocks[target];
    if (!a || !b) return;
    const next = [...blocks];
    next[index] = b;
    next[target] = a;
    onChange(next);
  }

  return (
    <div className="grid gap-3">
      {blocks.map((block, i) => (
        <div key={i} className="border border-line bg-bg2 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <select
              value={block.type}
              onChange={(e) => changeType(i, e.target.value as PostBlock["type"])}
              className="border border-line bg-bg px-2.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-fg2 outline-none focus:border-accent"
            >
              {BLOCK_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.1em] text-fg3">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="hover:text-fg disabled:opacity-30">
                ↑ Up
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === blocks.length - 1}
                className="hover:text-fg disabled:opacity-30"
              >
                ↓ Down
              </button>
              <button type="button" onClick={() => remove(i)} className="hover:text-red-400">
                Remove
              </button>
            </div>
          </div>

          {block.type === "callout" ? (
            <div className="grid gap-2.5">
              <Input
                placeholder="Callout label (e.g. “If you do one thing”)"
                value={block.label}
                onChange={(e) => updateBlock(i, { label: e.target.value } as Partial<PostBlock>)}
              />
              <Textarea rows={3} placeholder="Callout text" value={block.text} onChange={(e) => updateBlock(i, { text: e.target.value })} />
            </div>
          ) : (
            <Textarea
              rows={block.type === "heading" ? 1 : 4}
              placeholder={block.type === "heading" ? "Heading text" : block.type === "quote" ? "Quote text" : "Paragraph text"}
              value={block.text}
              onChange={(e) => updateBlock(i, { text: e.target.value })}
            />
          )}
        </div>
      ))}

      <div className="flex flex-wrap gap-2">
        {BLOCK_TYPES.map((t) => (
          <AdminButton key={t} type="button" onClick={() => onChange([...blocks, emptyBlock(t)])}>
            + {t}
          </AdminButton>
        ))}
      </div>
    </div>
  );
}
