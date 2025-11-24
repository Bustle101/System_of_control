import { useMemo } from "react";

export default function CommentList({ comments }) {
 
  const renderedComments = useMemo(() => {
    return comments.map((c) => (
      <div
        key={c.id}
        style={{
          background: "#eef4ff",
          padding: 12,
          borderRadius: 8,
          borderLeft: "4px solid #4a75d9"
        }}
      >
        <strong>{c.username || "Пользователь"}</strong>
        <p style={{ margin: "6px 0" }}>{c.message}</p>
        <small>{new Date(c.created_at).toLocaleString()}</small>
      </div>
    ));
  }, [comments]);

  return (
    <div style={{ marginTop: 25 }} key={`comments-list-${comments.length}`}>
      <h3>Комментарии</h3>

      {comments.length === 0 && <p>Комментариев пока нет</p>}

      <div style={{ display: "grid", gap: 12 }}>
        {renderedComments}
      </div>
    </div>
  );
}
