# Bảng Thưa (Sparse Table)

Bảng thưa (Sparse Table) là một cấu trúc dữ liệu cho phép trả lời các truy vấn trên đoạn (range queries) hiệu quả. Đặc biệt, nó mạnh mẽ nhất với các truy vấn tìm giá trị nhỏ nhất (RMQ - Range Minimum Query) hoặc lớn nhất trên đoạn, với thời gian truy vấn $O(1)$.

**Lưu ý:** Sparse Table chỉ áp dụng cho mảng bất biến (immutable array), tức là mảng không thay đổi giữa các truy vấn. Nếu có bất kỳ phần tử nào thay đổi, toàn bộ cấu trúc phải được xây dựng lại.

---

## 1. Trực giác và ý tưởng

Bất kỳ số nguyên không âm nào cũng có thể được biểu diễn duy nhất dưới dạng tổng các lũy thừa của hai giảm dần (dạng nhị phân). Ví dụ: $13 = (1101)_2 = 8 + 4 + 1$. Do đó, một đoạn bất kỳ $[L, R]$ cũng có thể được phân tách thành hợp của các đoạn có độ dài là lũy thừa của hai, với số đoạn tối đa là $\lceil \log_2(R-L+1) \rceil$.

**Ý tưởng chính:**
- Tiền xử lý trước tất cả các truy vấn trên đoạn có độ dài là lũy thừa của hai.
- Khi cần truy vấn trên đoạn bất kỳ, ta chia nhỏ đoạn đó thành các đoạn lũy thừa hai, tra cứu kết quả đã tiền xử lý và kết hợp lại.

---

## 2. Tiền xử lý (Precomputation)

Sử dụng mảng hai chiều `st[i][j]` lưu kết quả cho đoạn $[j, j + 2^i - 1]$ (độ dài $2^i$).
- Kích thước: $(K+1) \times \text{MAXN}$, với $K \ge \lfloor \log_2 \text{MAXN} \rfloor$.
- $\text{MAXN}$ là độ dài mảng lớn nhất cần hỗ trợ.

Ví dụ khai báo:
```cpp
int st[K + 1][MAXN];
```

Cách xây dựng bảng:
```cpp
std::copy(array.begin(), array.end(), st[0]);
for (int i = 1; i <= K; i++)
    for (int j = 0; j + (1 << i) <= N; j++)
        st[i][j] = f(st[i - 1][j], st[i - 1][j + (1 << (i - 1))]);
```
Trong đó $f$ là hàm kết hợp phù hợp với loại truy vấn (ví dụ: tổng, min, max).

Độ phức tạp tiền xử lý: $O(N \log N)$.

---

## 3. Truy vấn tổng đoạn (Range Sum Queries)

Với truy vấn tổng đoạn, $f(x, y) = x + y$.

```cpp
long long st[K + 1][MAXN];
std::copy(array.begin(), array.end(), st[0]);
for (int i = 1; i <= K; i++)
    for (int j = 0; j + (1 << i) <= N; j++)
        st[i][j] = st[i - 1][j] + st[i - 1][j + (1 << (i - 1))];
```

Để truy vấn tổng trên đoạn $[L, R]$:
```cpp
long long sum = 0;
for (int i = K; i >= 0; i--) {
    if ((1 << i) <= R - L + 1) {
        sum += st[i][L];
        L += 1 << i;
    }
}
```
Độ phức tạp truy vấn: $O(\log N)$.

---

## 4. Truy vấn giá trị nhỏ nhất đoạn (Range Minimum Queries - RMQ)

Đây là trường hợp tối ưu nhất của Sparse Table. Với truy vấn min, ta có thể chia đoạn $[L, R]$ thành hai đoạn lồng nhau có độ dài lũy thừa hai:
- $[L, L + 2^i - 1]$
- $[R - 2^i + 1, R]$
Trong đó $i = \lfloor \log_2(R-L+1) \rfloor$.

Kết quả truy vấn:
$$
\min(\text{st}[i][L], \text{st}[i][R - 2^i + 1])
$$

Cần tiền xử lý mảng log:
```cpp
int lg[MAXN+1];
lg[1] = 0;
for (int i = 2; i <= MAXN; i++)
    lg[i] = lg[i/2] + 1;
```

Hoặc tính log2 trực tiếp (C++20):
```cpp
#include <bit>
int log2_floor(unsigned long i) {
    return std::bit_width(i) - 1;
}
```

Xây dựng bảng min:
```cpp
int st[K + 1][MAXN];
std::copy(array.begin(), array.end(), st[0]);
for (int i = 1; i <= K; i++)
    for (int j = 0; j + (1 << i) <= N; j++)
        st[i][j] = min(st[i - 1][j], st[i - 1][j + (1 << (i - 1))]);
```

Truy vấn min trên đoạn $[L, R]$:
```cpp
int i = lg[R - L + 1];
int minimum = min(st[i][L], st[i][R - (1 << i) + 1]);
```

Độ phức tạp truy vấn: $O(1)$.

---

## 5. Các cấu trúc tương tự hỗ trợ nhiều loại truy vấn hơn

Cách truy vấn $O(1)$ ở trên chỉ áp dụng cho các hàm **idempotent** (kết hợp nhiều lần không thay đổi kết quả, ví dụ: min, max, gcd). Với các hàm kết hợp bất kỳ (như tổng), không thể truy vấn $O(1)$ bằng Sparse Table thông thường.

Một số cấu trúc mở rộng:
- [Disjoint Sparse Table](https://discuss.codechef.com/questions/117696/tutorial-disjoint-sparse-table)
- [Sqrt Tree](https://cp-algorithms.com/data_structures/sqrt-tree.html)

---

## 6. Bài tập luyện tập
- [SPOJ - RMQSQ](http://www.spoj.com/problems/RMQSQ/)
- [SPOJ - THRBL](http://www.spoj.com/problems/THRBL/)
- [Codechef - MSTICK](https://www.codechef.com/problems/MSTICK)
- [Codechef - SEAD](https://www.codechef.com/problems/SEAD)
- [Codeforces - CGCDSSQ](http://codeforces.com/contest/475/problem/D)
- [Codeforces - R2D2 and Droid Army](http://codeforces.com/problemset/problem/514/D)
- [Codeforces - Maximum of Maximums of Minimums](http://codeforces.com/problemset/problem/872/B)
- [SPOJ - Miraculous](http://www.spoj.com/problems/TNVFC1M/)
- [DevSkill - Multiplication Interval (archived)](http://web.archive.org/web/20200922003506/https://devskill.com/CodingProblems/ViewProblem/19)
- [Codeforces - Animals and Puzzles](http://codeforces.com/contest/713/problem/D)
- [Codeforces - Trains and Statistics](http://codeforces.com/contest/675/problem/E)
- [SPOJ - Postering](http://www.spoj.com/problems/POSTERIN/)
- [SPOJ - Negative Score](http://www.spoj.com/problems/RPLN/)
- [SPOJ - A Famous City](http://www.spoj.com/problems/CITY2/)
- [SPOJ - Diferencija](http://www.spoj.com/problems/DIFERENC/)
- [Codeforces - Turn off the TV](http://codeforces.com/contest/863/problem/E)
- [Codeforces - Map](http://codeforces.com/contest/15/problem/D)
- [Codeforces - Awards for Contestants](http://codeforces.com/contest/873/problem/E)
- [Codeforces - Longest Regular Bracket Sequence](http://codeforces.com/contest/5/problem/C)
- [Codeforces - Array Stabilization (GCD version)](http://codeforces.com/problemset/problem/1547/F)

---

## 7. Tham khảo
- [Bản gốc tiếng Anh trên CP-Algorithms](https://cp-algorithms.com/data_structures/sparse-table.html)
- Bản quyền: [CC BY-SA 4.0](https://github.com/cp-algorithms/cp-algorithms/blob/main/LICENSE)

---

*Dịch và biên soạn bởi CacBaiDocThuatToan*
