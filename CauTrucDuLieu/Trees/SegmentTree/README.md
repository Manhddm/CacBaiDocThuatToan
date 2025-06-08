# Cây Đoạn (Segment Tree)

Cây đoạn (Segment Tree) là một cấu trúc dữ liệu lưu trữ thông tin về các đoạn (interval) của một mảng dưới dạng cây. Nhờ đó, ta có thể trả lời các truy vấn trên đoạn của mảng một cách hiệu quả, đồng thời vẫn linh hoạt cho phép cập nhật nhanh giá trị của mảng. Các ứng dụng phổ biến bao gồm: tính tổng đoạn $a[l \dots r]$, tìm giá trị nhỏ nhất/lớn nhất trên đoạn, cập nhật một phần tử hoặc thậm chí cập nhật cả một đoạn (gán giá trị hoặc cộng thêm vào tất cả các phần tử trên đoạn).

Cây đoạn rất linh hoạt, giải quyết được nhiều bài toán khác nhau, kể cả các bài toán nâng cao (xem phần "Các biến thể nâng cao"). Ngoài ra, cây đoạn còn có thể mở rộng lên nhiều chiều, ví dụ như cây đoạn 2D để truy vấn tổng hoặc min/max trên hình chữ nhật con của ma trận chỉ trong $O(\log^2 n)$.

Một đặc điểm quan trọng là cây đoạn chỉ cần bộ nhớ tuyến tính, với $4n$ đỉnh cho mảng kích thước $n$.

---

## Dạng đơn giản nhất của cây đoạn

### Bài toán cơ bản
Cho mảng $a[0 \dots n-1]$, cần hỗ trợ hai loại truy vấn:
- Tính tổng các phần tử trên đoạn $[l, r]$ (tức là $\sum_{i=l}^r a[i]$)
- Cập nhật giá trị một phần tử $a[i] = x$

Cả hai truy vấn đều cần thực hiện trong $O(\log n)$.

### Cấu trúc cây đoạn
Ta chia mảng thành các đoạn con theo phương pháp chia để trị. Đỉnh gốc lưu tổng toàn mảng $a[0 \dots n-1]$, sau đó chia đôi thành $a[0 \dots n/2-1]$ và $a[n/2 \dots n-1]$, tiếp tục chia nhỏ cho đến khi mỗi đoạn chỉ còn 1 phần tử.

Cây này là cây nhị phân, mỗi đỉnh (trừ lá) có đúng 2 con. Đỉnh gốc là đoạn $a[0 \dots n-1]$. Tổng số đỉnh tối đa là $1 + 2 + 4 + ... + 2^{\lceil\log_2 n\rceil} < 4n$.

> ![Minh họa cây đoạn tổng](https://cp-algorithms.com/data_structures/sum-segment-tree.png)

Nếu $n$ không phải lũy thừa của 2, một số tầng sẽ không đầy đủ.

Chiều cao cây là $O(\log n)$.

### Xây dựng cây đoạn
- Mỗi đỉnh lưu giá trị đại diện cho đoạn (ví dụ tổng đoạn, min, max, ...)
- Hàm "gộp" (merge) hai con để tính giá trị đỉnh cha (ví dụ tổng, min, max, ...)
- Đỉnh lá lưu giá trị phần tử tương ứng $a[i]$

Xây dựng cây đoạn thường dùng đệ quy từ gốc xuống lá:
1. Đệ quy xây hai con
2. Gộp kết quả hai con để tính giá trị đỉnh hiện tại

Độ phức tạp xây dựng: $O(n)$.

### Truy vấn tổng đoạn
Để tính tổng đoạn $a[l \dots r]$:
- Nếu đoạn truy vấn trùng hoàn toàn đoạn của đỉnh hiện tại, trả về giá trị đã lưu
- Nếu đoạn truy vấn nằm hoàn toàn bên trái hoặc phải, đệ quy xuống con tương ứng
- Nếu đoạn truy vấn cắt cả hai con, chia thành hai truy vấn con, cộng kết quả

> ![Minh họa truy vấn tổng đoạn](https://cp-algorithms.com/data_structures/sum-segment-tree-query.png)

Độ phức tạp: $O(\log n)$ (mỗi tầng chỉ tối đa 4 đỉnh được duyệt)

### Cập nhật một phần tử
Để cập nhật $a[i] = x$:
- Chỉ cần cập nhật $O(\log n)$ đỉnh trên đường đi từ gốc đến lá tương ứng
- Đệ quy xuống con chứa $i$, sau đó cập nhật lại giá trị đỉnh cha

> ![Minh họa cập nhật phần tử](https://cp-algorithms.com/data_structures/sum-segment-tree-update.png)

### Cài đặt cơ bản (C++)
```cpp
int n, t[4*MAXN];

void build(int a[], int v, int tl, int tr) {
    if (tl == tr) {
        t[v] = a[tl];
    } else {
        int tm = (tl + tr) / 2;
        build(a, v*2, tl, tm);
        build(a, v*2+1, tm+1, tr);
        t[v] = t[v*2] + t[v*2+1];
    }
}

int sum(int v, int tl, int tr, int l, int r) {
    if (l > r) return 0;
    if (l == tl && r == tr) return t[v];
    int tm = (tl + tr) / 2;
    return sum(v*2, tl, tm, l, std::min(r, tm))
         + sum(v*2+1, tm+1, tr, std::max(l, tm+1), r);
}

void update(int v, int tl, int tr, int pos, int new_val) {
    if (tl == tr) {
        t[v] = new_val;
    } else {
        int tm = (tl + tr) / 2;
        if (pos <= tm)
            update(v*2, tl, tm, pos, new_val);
        else
            update(v*2+1, tm+1, tr, pos, new_val);
        t[v] = t[v*2] + t[v*2+1];
    }
}
```

### Tối ưu bộ nhớ
Có thể đánh số đỉnh cây theo Euler tour để giảm bộ nhớ xuống $2n$.

---

## Các biến thể nâng cao

### Truy vấn phức tạp hơn
- **Tìm max/min đoạn:** chỉ cần thay phép cộng bằng phép max/min trong các hàm build, update, sum.
- **Tìm max và số lần xuất hiện:** mỗi đỉnh lưu pair (giá trị lớn nhất, số lần xuất hiện), hàm gộp sẽ cộng số lần nếu hai con cùng max.
- **Tìm GCD/LCM đoạn:** mỗi đỉnh lưu GCD/LCM đoạn, hàm gộp là gcd/lcm.
- **Đếm số lượng số 0, tìm vị trí số 0 thứ k:** mỗi đỉnh lưu số lượng số 0, truy vấn tìm vị trí số 0 thứ k bằng cách đi xuống con phù hợp.
- **Tìm chỉ số đầu tiên có tổng prefix ≥ x:** đi xuống con trái/phải tùy tổng prefix.
- **Tìm chỉ số đầu tiên lớn hơn x trên đoạn:** đi xuống con trái/phải tùy giá trị max.
- **Tìm đoạn con có tổng lớn nhất:** mỗi đỉnh lưu 4 giá trị: tổng đoạn, tổng prefix lớn nhất, tổng suffix lớn nhất, tổng đoạn con lớn nhất. Hàm gộp tính các giá trị này từ hai con.

### Lưu toàn bộ đoạn tại mỗi đỉnh (Merge Sort Tree)
- Mỗi đỉnh lưu vector các phần tử đã sắp xếp của đoạn tương ứng
- Truy vấn tìm số nhỏ nhất ≥ x trên đoạn bằng lower_bound
- Có thể mở rộng cho phép cập nhật bằng multiset
- Có thể tăng tốc bằng "fractional cascading"

### Cập nhật đoạn (Lazy Propagation)
- **Cộng thêm trên đoạn:** mỗi đỉnh lưu giá trị cộng dồn, khi truy vấn/cập nhật thì "đẩy" (push) giá trị này xuống các con
- **Gán giá trị trên đoạn:** mỗi đỉnh lưu cờ đánh dấu đã gán, khi cần thì push xuống các con
- **Cộng trên đoạn, truy vấn max:** mỗi đỉnh lưu max và giá trị cộng dồn, push khi cần

### Tổng quát hóa lên nhiều chiều
- Cây đoạn 2D: mỗi đỉnh của cây đoạn theo chiều x lại là một cây đoạn theo chiều y
- Truy vấn và cập nhật đều thực hiện hai lần đệ quy

### Cây đoạn bền vững (Persistent Segment Tree)
- Lưu lại lịch sử các phiên bản cây đoạn sau mỗi lần cập nhật
- Mỗi lần cập nhật chỉ tạo mới $O(\log n)$ đỉnh trên đường đi, các đỉnh còn lại dùng lại
- Ứng dụng: tìm phần tử nhỏ thứ k trên đoạn, undo truy vấn, ...

### Cây đoạn động (Dynamic Segment Tree)
- Chỉ tạo các đỉnh khi cần thiết, phù hợp cho mảng rất lớn nhưng chỉ cập nhật/truy vấn trên một số ít vị trí

---

## Bài tập luyện tập
- [SPOJ - KQUERY](http://www.spoj.com/problems/KQUERY/) (Persistent segment tree / Merge sort tree)
- [Codeforces - Xenia and Bit Operations](https://codeforces.com/problemset/problem/339/D)
- [UVA 11402 - Ahoy, Pirates!](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=2397)
- [SPOJ - GSS3](http://www.spoj.com/problems/GSS3/)
- [Codeforces - Distinct Characters Queries](https://codeforces.com/problemset/problem/1234/D)
- [Codeforces - Knight Tournament](https://codeforces.com/contest/356/problem/A)
- [Codeforces - Ant colony](https://codeforces.com/contest/474/problem/F)
- [Codeforces - Drazil and Park](https://codeforces.com/contest/515/problem/E)
- [Codeforces - Circular RMQ](https://codeforces.com/problemset/problem/52/C)
- [Codeforces - Lucky Array](https://codeforces.com/contest/121/problem/E)
- [Codeforces - The Child and Sequence](https://codeforces.com/contest/438/problem/D)
- [Codeforces - DZY Loves Fibonacci Numbers](https://codeforces.com/contest/446/problem/C)
- [Codeforces - Alphabet Permutations](https://codeforces.com/problemset/problem/610/E)
- [Codeforces - Eyes Closed](https://codeforces.com/problemset/problem/895/E)
- [Codeforces - Kefa and Watch](https://codeforces.com/problemset/problem/580/E)
- [Codeforces - A Simple Task](https://codeforces.com/problemset/problem/558/E)
- [Codeforces - SUM and REPLACE](https://codeforces.com/problemset/problem/920/F)
- [Codeforces - XOR on Segment](https://codeforces.com/problemset/problem/242/E)
- [Codeforces - Please, another Queries on Array?](https://codeforces.com/problemset/problem/1114/F)
- [COCI - Deda](https://oj.uz/problem/view/COCI17_deda)
- [Codeforces - The Untended Antiquity](https://codeforces.com/problemset/problem/869/E)
- [CSES - Hotel Queries](https://cses.fi/problemset/task/1143)
- [CSES - Polynomial Queries](https://cses.fi/problemset/task/1736)
- [CSES - Range Updates and Sums](https://cses.fi/problemset/task/1735)

---

## Tham khảo
- [Bản gốc tiếng Anh trên CP-Algorithms](https://cp-algorithms.com/data_structures/segment_tree.html)
- [Tài liệu tham khảo khác](https://github.com/cp-algorithms/cp-algorithms/blob/main/LICENSE)

---

*Bản dịch bởi CacBaiDocThuatToan, tuân thủ giấy phép [CC BY-SA 4.0](https://github.com/cp-algorithms/cp-algorithms/blob/main/LICENSE).*
