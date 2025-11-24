import { useState, useRef } from "react";
import api from "../../api/axios";

export default function CommentForm({ defectId, onAdded }) {
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const textareaRef = useRef(null); 

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      setPending(true);

      await api.post(`/orders/defects/comments/${defectId}`, {
        message: text.trim()
      });

      setText("");
      onAdded();

  
      textareaRef.current?.blur();
      
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ marginTop: 20, display: "grid", gap: 10 }}>
      <label>
        Комментарий
        <textarea
          ref={textareaRef} 
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus={false}
          rows="3"
          style={{ width: "100%" }}
        />
      </label>

      <button className="adminbutton" disabled={pending}>
        {pending ? "Добавление..." : "Добавить комментарий"}
      </button>
    </form>
  );
}
