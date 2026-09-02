import { Pagination } from "react-bootstrap";

function MoviePagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="d-flex justify-content-center mt-5">
      <Pagination>

        <Pagination.Prev
          disabled={currentPage === 1}
          onClick={() =>
            onPageChange(currentPage - 1)
          }
        />

        {Array.from(
          { length: totalPages },
          (_, index) => index + 1
        ).map((page) => (
          <Pagination.Item
            key={page}
            active={page === currentPage}
            onClick={() =>
              onPageChange(page)
            }
          >
            {page}
          </Pagination.Item>
        ))}

        <Pagination.Next
          disabled={
            currentPage === totalPages
          }
          onClick={() =>
            onPageChange(currentPage + 1)
          }
        />

      </Pagination>
    </div>
  );
}

export default MoviePagination;