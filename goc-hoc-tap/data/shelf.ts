/*
 * Kệ sách đọc của Liu. Thêm sách thật vào các mảng bên dưới rồi deploy.
 * Để trống thì trang /shelf hiện chỗ trống, không hiện sách giả.
 *
 * Ví dụ một cuốn đang đọc:
 *   { title: "Tên sách", author: "Tác giả", cover: "/shelf/ten-sach.jpg", page: 120, pages: 300 }
 * `cover` là tùy chọn. Không có ảnh thì bìa được dựng từ tên sách.
 */
export type ShelfBook = {
  title: string;
  author: string;
  cover?: string;
  /** Trang đang đọc và tổng số trang, chỉ cần cho sách đang đọc. */
  page?: number;
  pages?: number;
};

export type ShelfQuote = { text: string; book: string; author?: string };

export const reading: ShelfBook[] = [];
export const wantToRead: ShelfBook[] = [];
export const finished: ShelfBook[] = [];
export const favoriteQuotes: ShelfQuote[] = [];
