export default function Paragraph({title, description}){
  return(
    <li>
      <p>
        <strong>{title}</strong>
        {description}
      </p>
    </li>
  )
}