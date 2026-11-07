import type { Metadata } from "next";
import { favoriteQuotes, finished, reading, wantToRead, type ShelfBook } from "@/data/shelf";

export const metadata: Metadata = {
  title: "Kệ sách",
  description: "Những cuốn sách Liu đang đọc, muốn đọc và đã đọc xong.",
};

function BookCard({ book, progress }: { book: ShelfBook; progress?: boolean }) {
  const percent = book.page && book.pages ? Math.min(100, Math.round((book.page / book.pages) * 100)) : null;
  return (
    <li className="shelf-book">
      <div className="cover" data-static>
        {book.cover ? (
          // eslint-disable-next-line @next/next/no-img-element -- bìa do Liu tự thêm, kích thước bất kỳ
          <img src={book.cover} alt="" loading="lazy" />
        ) : (
          <span className="cover-title">{book.title}</span>
        )}
      </div>
      <h3>{book.title}</h3>
      <p>{book.author}</p>
      {progress && percent !== null && (
        <>
          <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-label={`Tiến độ đọc ${book.title}`}>
            <span style={{ width: `${percent}%` }} />
          </div>
          <p className="muted">Trang {book.page}/{book.pages} · {percent}%</p>
        </>
      )}
    </li>
  );
}

function Shelf({ title, books, progress }: { title: string; books: ShelfBook[]; progress?: boolean }) {
  return (
    <section className="reading-shelf">
      <h2>{title} <small>{books.length}</small></h2>
      {books.length > 0 ? (
        <ul className="shelf-books">
          {books.map((book) => <BookCard key={book.title} book={book} progress={progress} />)}
        </ul>
      ) : (
        <p className="muted">Chưa có cuốn nào ở ngăn này.</p>
      )}
    </section>
  );
}

export default function ShelfPage() {
  return (
    <div className="page wide shelf-page">
      <h1>Kệ sách</h1>
      <p className="shelf-intro">Những cuốn sách đi cùng mình. Truyện do mình viết nằm ở Liu&apos;s Book.</p>

      {reading.length + wantToRead.length + finished.length > 0 ? (
        <>
          <Shelf title="Đang đọc" books={reading} progress />
          <div className="shelf-pair">
            <Shelf title="Muốn đọc" books={wantToRead} />
            <Shelf title="Đã đọc" books={finished} />
          </div>
        </>
      ) : (
        <section className="shelf-blank">
          <ul>
            <li><h2>Đang đọc</h2></li>
            <li><h2>Muốn đọc</h2></li>
            <li><h2>Đã đọc</h2></li>
          </ul>
          <p>Kệ đang chờ cuốn sách đầu tiên.</p>
        </section>
      )}

      <section className="reading-shelf">
        <h2>Trích dẫn yêu thích</h2>
        {favoriteQuotes.length > 0 ? (
          <ul className="quote-wall">
            {favoriteQuotes.map((q) => (
              <li key={q.text}>
                <blockquote>{q.text}</blockquote>
                <cite>{q.book}{q.author ? `, ${q.author}` : ""}</cite>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">Những câu muốn giữ lại sẽ nằm ở đây.</p>
        )}
      </section>
    </div>
  );
}
