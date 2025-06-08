# Sqrt Decomposition (Phân đoạn căn bậc hai)

Sqrt Decomposition (Phân đoạn căn bậc hai) là một kỹ thuật/cấu trúc dữ liệu cho phép thực hiện các phép toán phổ biến trên mảng (như tính tổng đoạn, tìm min/max đoạn, đếm số phần tử thỏa mãn điều kiện, v.v.) với độ phức tạp $O(\sqrt{n})$, nhanh hơn nhiều so với cách duyệt thông thường $O(n)$.

---

## 1. Ý tưởng cơ bản

Chia mảng $a$ thành các khối (block) có độ dài xấp xỉ $\sqrt{n}$:

- Số khối và kích thước mỗi khối đều xấp xỉ $s = \lceil \sqrt{n} \rceil$.
- Mỗi khối $b[i]$ lưu tổng các phần tử thuộc khối đó:

$$b[k] = \sum\limits_{i=k\cdot s}^{\min(n-1, (k+1)\cdot s-1)} a[i]$$

- Khối cuối cùng có thể ngắn hơn các khối còn lại.

---

## 2. Truy vấn tổng đoạn $[l, r]$

- Nếu $[l, r]$ nằm trong cùng một khối, tính tổng trực tiếp.
- Nếu không, tổng đoạn $[l, r]$ gồm:
    - Đoạn "đuôi" trái: $[l, (k+1)\cdot s-1]$
    - Các khối đầy đủ nằm giữa: $b[k+1]$ đến $b[p-1]$
    - Đoạn "đuôi" phải: $[p\cdot s, r]$

$$
\sum\limits_{i=l}^r a[i] = \sum\limits_{i=l}^{(k+1) \cdot s-1} a[i] + \sum\limits_{i=k+1}^{p-1} b[i] + \sum\limits_{i=p\cdot s}^r a[i]
$$

- Độ phức tạp: mỗi "đuôi" dài tối đa $s$, số khối tối đa $s$ $\Rightarrow$ tổng $O(\sqrt{n})$.

---

## 3. Cài đặt cơ bản

```cpp
int n;
vector<int> a(n);

// Tiền xử lý
int len = (int) sqrt(n + .0) + 1; // kích thước khối
vector<int> b(len);
for (int i = 0; i < n; ++i)
    b[i / len] += a[i];

// Truy vấn tổng đoạn [l, r]
int sum = 0;
int c_l = l / len, c_r = r / len;
if (c_l == c_r)
    for (int i = l; i <= r; ++i)
        sum += a[i];
else {
    for (int i = l, end = (c_l + 1) * len - 1; i <= end; ++i)
        sum += a[i];
    for (int i = c_l + 1; i <= c_r - 1; ++i)
        sum += b[i];
    for (int i = c_r * len; i <= r; ++i)
        sum += a[i];
}
```

---

## 4. Cập nhật phần tử

Khi thay đổi $a[i]$, chỉ cần cập nhật lại $b[i/len]$:

$$b[k] += a_{new}[i] - a_{old}[i]$$

---

## 5. Mở rộng và các bài toán khác

- **Tìm min/max đoạn:**
    - $b[k]$ lưu min/max của khối. Khi cập nhật phần tử, phải duyệt lại toàn bộ khối $O(s)$.
- **Đếm số phần tử thỏa mãn điều kiện, tìm phần tử đầu tiên khác 0, ...**
- **Cập nhật đoạn:**
    - Ví dụ: tăng tất cả các phần tử trên đoạn $[l, r]$ lên $\delta$.
    - Lưu thêm $b[k]$ cho mỗi khối, khi cập nhật đoạn thì cập nhật $b[k]$ cho các khối đầy đủ, cập nhật trực tiếp $a[i]$ cho các "đuôi".
    - Truy vấn giá trị tại $i$: $a[i] + b[i/len]$.
- **Kết hợp cập nhật đoạn và truy vấn đoạn:**
    - Dùng hai mảng block $b$ và $c$ để lưu thông tin cập nhật và truy vấn.
- **Quản lý tập hợp động:**
    - Chia tập hợp thành các khối, mỗi khối chứa $\sqrt{n}$ phần tử, khi thêm/xóa thì cân bằng lại các khối.

---

## 6. Mo's Algorithm (Thuật toán Mo)

Mo's Algorithm là một ứng dụng của sqrt decomposition cho các bài toán truy vấn offline trên mảng.

- Ý tưởng: Sắp xếp các truy vấn theo block của chỉ số trái, trong mỗi block sắp theo chỉ số phải.
- Duy trì một cấu trúc dữ liệu cho đoạn hiện tại, di chuyển biên trái/phải để mở rộng/thu hẹp đoạn, cập nhật cấu trúc dữ liệu tương ứng.
- Độ phức tạp: $O((N+Q)\sqrt{N})$ với $N$ là độ dài mảng, $Q$ là số truy vấn.

**Cài đặt mẫu:**
```cpp
void remove(idx);  // Xóa giá trị tại idx khỏi cấu trúc dữ liệu
void add(idx);     // Thêm giá trị tại idx vào cấu trúc dữ liệu
int get_answer();  // Lấy kết quả hiện tại

int block_size;

struct Query {
    int l, r, idx;
    bool operator<(Query other) const {
        return make_pair(l / block_size, r) < make_pair(other.l / block_size, other.r);
    }
};

vector<int> mo_s_algorithm(vector<Query> queries) {
    vector<int> answers(queries.size());
    sort(queries.begin(), queries.end());
    int cur_l = 0, cur_r = -1;
    for (Query q : queries) {
        while (cur_l > q.l) add(--cur_l);
        while (cur_r < q.r) add(++cur_r);
        while (cur_l < q.l) remove(cur_l++);
        while (cur_r > q.r) remove(cur_r--);
        answers[q.idx] = get_answer();
    }
    return answers;
}
```

**Tối ưu:**
- Có thể chọn block size khác $\sqrt{N}$ để tối ưu thực tế.
- Trong các block lẻ, sắp xếp chỉ số phải giảm dần để giảm số lần di chuyển con trỏ phải.

---

## 7. Bài tập luyện tập
- [Codeforces - Kuriyama Mirai's Stones](https://codeforces.com/problemset/problem/433/B)
- [UVA - 12003 - Array Transformer](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=3154)
- [UVA - 11990 Dynamic Inversion](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=3141)
- [SPOJ - Give Away](http://www.spoj.com/problems/GIVEAWAY/)
- [Codeforces - Till I Collapse](http://codeforces.com/contest/786/problem/C)
- [Codeforces - Destiny](http://codeforces.com/contest/840/problem/D)
- [Codeforces - Holes](http://codeforces.com/contest/13/problem/E)
- [Codeforces - XOR and Favorite Number](https://codeforces.com/problemset/problem/617/E)
- [Codeforces - Powerful array](http://codeforces.com/problemset/problem/86/D)
- [SPOJ - DQUERY](https://www.spoj.com/problems/DQUERY)
- [Codeforces - Robin Hood Archery](https://codeforces.com/contest/2014/problem/H)

---

## 8. Tham khảo
- [Bản gốc tiếng Anh trên CP-Algorithms](https://cp-algorithms.com/data_structures/sqrt_decomposition.html)
- Bản quyền: [CC BY-SA 4.0](https://github.com/cp-algorithms/cp-algorithms/blob/main/LICENSE)

---

*Dịch và biên soạn bởi CacBaiDocThuatToan*
