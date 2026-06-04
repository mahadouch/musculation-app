export default function Schedule({ data }) {
  return (
    <>
      <h2 className="section-title">
        <span className="icon">📅</span> PLANNING HEBDOMADAIRE
      </h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Jour</th>
              <th>Activité</th>
              <th>Durée</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 700 }}>{item.day}</td>
                <td>{item.activity}</td>
                <td>
                  <span className="tag tag-blue">{item.duration}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
