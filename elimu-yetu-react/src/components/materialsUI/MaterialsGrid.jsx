import MaterialCard from "../MaterialCard";

function MaterialsGrid({ items }) {
  return (
    <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3">
      {items.map((item) => (
        <div className="col" key={item._id}>
          <MaterialCard
            _id={item._id}
            title={item.title}
            grade={item.grade}
            term={item.term}
            coverImage={item.coverImage}
            isFree={item.isFree}
            price={item.price}
          />
        </div>
      ))}
    </div>
  );
}

export default MaterialsGrid;