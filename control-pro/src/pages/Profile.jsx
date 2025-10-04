import Header from "../components/Header/Header";

export default function Profile() {
  return (
    <div className="basa">
       <Header></Header>
       <main>
        <div className="profile-header">
            <div className="profile-info">
            <p><strong>Логин:</strong> user123</p>
            <p><strong>Роль:</strong> Менеджер</p>
            </div>

            <div className="profile-photo">
            <span>Фото</span>
            </div>
        </div>

        <button className="btn-primary">Изменить пароль</button>
      </main> 
    </div>
  );
}
