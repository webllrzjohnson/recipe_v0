'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import YoutubeEmbed from '@tiptap/extension-youtube';
import Placeholder from '@tiptap/extension-placeholder';
import { Toggle } from '@/components/ui/toggle';
import { Button } from '@/components/ui/button';
import { AdminImageUploadButton } from '@/components/admin/admin-image-upload-button';
import { Separator } from '@/components/ui/separator';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link2,
  ImageIcon,
  Heading2,
  Heading3,
  Youtube as YoutubeIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecipeRichTextEditorProps {
  id?: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export function RecipeRichTextEditor({
  id,
  value,
  onChange,
  placeholder = 'Write the story readers see before the recipe card…',
  className,
}: RecipeRichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: {
            class: 'text-primary underline underline-offset-2',
          },
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-sm border border-border',
        },
      }),
      YoutubeEmbed.configure({
        width: 640,
        height: 360,
        nocookie: true,
        HTMLAttributes: {
          class: 'recipe-youtube-embed rounded-sm',
        },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        id: id ?? '',
        class: 'tiptap recipe-rich-text-editor-inner focus:outline-none',
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
  });

  if (!editor) {
    return (
      <div
        className={cn(
          'min-h-[200px] animate-pulse rounded-md border border-input bg-muted/40',
          className
        )}
      />
    );
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt(
      'Link URL',
      typeof previousUrl === 'string' ? previousUrl : 'https://'
    );
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt('Image URL (https://…)');
    if (url?.trim()) {
      editor.chain().focus().setImage({ src: url.trim() }).run();
    }
  };

  const addYoutube = () => {
    const url = window.prompt('YouTube video URL');
    if (url?.trim()) {
      editor.chain().focus().setYoutubeVideo({ src: url.trim() }).run();
    }
  };

  return (
    <div className={cn('recipe-rich-text-editor space-y-2', className)}>
      <div className="flex flex-wrap items-center gap-1 rounded-md border border-input bg-muted/30 p-1">
        <Toggle
          size="sm"
          pressed={editor.isActive('bold')}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('italic')}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Separator orientation="vertical" className="mx-0.5 h-7" />
        <Toggle
          size="sm"
          pressed={editor.isActive('heading', { level: 2 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          aria-label="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('heading', { level: 3 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          aria-label="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Toggle>
        <Separator orientation="vertical" className="mx-0.5 h-7" />
        <Toggle
          size="sm"
          pressed={editor.isActive('bulletList')}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Bullet list"
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('orderedList')}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="Numbered list"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Separator orientation="vertical" className="mx-0.5 h-7" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={setLink}
          aria-label="Link"
        >
          <Link2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={addImage}
          aria-label="Insert image from URL"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <AdminImageUploadButton
          folder="recipe-blog"
          variant="ghost"
          size="sm"
          showLabel={false}
          className="h-8 px-2"
          onUploaded={(url) => editor.chain().focus().setImage({ src: url }).run()}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={addYoutube}
          aria-label="Insert YouTube video"
        >
          <YoutubeIcon className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent
        editor={editor}
        className="max-h-[min(28rem,55vh)] min-h-[12.5rem] overflow-y-auto rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs"
      />
    </div>
  );
}
