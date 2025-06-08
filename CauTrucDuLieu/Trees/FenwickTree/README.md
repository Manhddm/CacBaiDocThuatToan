# Cây Fenwick (Fenwick Tree / Binary Indexed Tree)

Cây Fenwick (hay còn gọi là Binary Indexed Tree - BIT) là một cấu trúc dữ liệu mạnh mẽ cho phép:
- Tính tổng (hoặc thực hiện phép toán nhóm khác) trên một đoạn $[l, r]$ trong $O(\log N)$.
- Cập nhật giá trị một phần tử trong $O(\log N)$.
- Yêu cầu bộ nhớ $O(N)$ và dễ mở rộng cho mảng nhiều chiều.

Cây Fenwick được Peter M. Fenwick giới thiệu năm 1994 trong bài báo "A new data structure for cumulative frequency tables".

---

## 1. Mô tả tổng quan

Giả sử ta có mảng $A[0 \dots N-1]$. Cây Fenwick là một mảng $T[0 \dots N-1]$, mỗi phần tử $T_i$ lưu tổng một đoạn con của $A$:

$$T_i = \sum_{j = g(i)}^{i}{A_j}$$

Hàm $g(i)$ xác định điểm bắt đầu của đoạn, sẽ được giải thích chi tiết bên dưới.

> **Lưu ý:** Có hai cách đánh chỉ số: bắt đầu từ 0 (zero-based) hoặc từ 1 (one-based). Bài này trình bày cả hai.

---

## 2. Ý tưởng hoạt động

### 2.1. Truy vấn tổng đoạn

- Để tính tổng $A[0] + ... + A[r]$, ta cộng các $T[r], T[g(r)-1], T[g(g(r)-1)-1], ...$ cho đến khi chỉ số âm.
- Mỗi lần "nhảy" là nhảy về đầu đoạn mà $T$ đang đại diện.

### 2.2. Cập nhật phần tử

- Khi tăng $A[i]$ lên $\delta$, ta cập nhật tất cả $T[j]$ sao cho $g(j) \leq i \leq j$.
- Có thể thực hiện bằng cách bắt đầu từ $i$ và liên tục "bật" bit 0 đầu tiên chưa set (chi tiết ở phần dưới).

---

## 3. Định nghĩa hàm $g(i)$ và $h(j)$

- $g(i)$: thay tất cả các bit 1 cuối cùng trong biểu diễn nhị phân của $i$ thành 0.
- Công thức: $g(i) = i \& (i+1)$ (toán tử AND bit).

Ví dụ:
- $g(11) = g(1011_2) = 1000_2 = 8$
- $g(12) = g(1100_2) = 1100_2 = 12$
- $g(15) = g(1111_2) = 0000_2 = 0$

- $h(j)$: lật bit 0 đầu tiên chưa set thành 1.
- Công thức: $h(j) = j | (j+1)$ (toán tử OR bit).

Ví dụ:
- $h(10) = 11$
- $h(11) = 15$
- $h(15) = 31$

---

## 4. Minh họa cấu trúc cây

Cây Fenwick có thể được hình dung như một cây nhị phân, mỗi node đại diện cho một đoạn con của mảng:

![Minh họa cây Fenwick](https://cp-algorithms.com/data_structures/binary_indexed_tree.png)

---

## 5. Cài đặt cơ bản (zero-based)

```cpp
struct FenwickTree {
    vector<int> bit;  // binary indexed tree
    int n;

    FenwickTree(int n) {
        this->n = n;
        bit.assign(n, 0);
    }

    FenwickTree(vector<int> const &a) : FenwickTree(a.size()) {
        for (size_t i = 0; i < a.size(); i++)
            add(i, a[i]);
    }

    int sum(int r) {
        int ret = 0;
        for (; r >= 0; r = (r & (r + 1)) - 1)
            ret += bit[r];
        return ret;
    }

    int sum(int l, int r) {
        return sum(r) - sum(l - 1);
    }

    void add(int idx, int delta) {
        for (; idx < n; idx = idx | (idx + 1))
            bit[idx] += delta;
    }
};
```

---

## 6. Xây dựng tuyến tính $O(N)$

```cpp
FenwickTree(vector<int> const &a) : FenwickTree(a.size()){
    for (int i = 0; i < n; i++) {
        bit[i] += a[i];
        int r = i | (i + 1);
        if (r < n) bit[r] += bit[i];
    }
}
```

---

## 7. Tìm min trên đoạn $[0, r]$

Không thể truy vấn min trên đoạn bất kỳ $[l, r]$ với Fenwick Tree thông thường, chỉ có thể truy vấn $[0, r]$ và chỉ khi cập nhật giá trị mới nhỏ hơn giá trị cũ.

```cpp
struct FenwickTreeMin {
    vector<int> bit;
    int n;
    const int INF = (int)1e9;

    FenwickTreeMin(int n) {
        this->n = n;
        bit.assign(n, INF);
    }

    FenwickTreeMin(vector<int> a) : FenwickTreeMin(a.size()) {
        for (size_t i = 0; i < a.size(); i++)
            update(i, a[i]);
    }

    int getmin(int r) {
        int ret = INF;
        for (; r >= 0; r = (r & (r + 1)) - 1)
            ret = min(ret, bit[r]);
        return ret;
    }

    void update(int idx, int val) {
        for (; idx < n; idx = idx | (idx + 1))
            bit[idx] = min(bit[idx], val);
    }
};
```

> **Tham khảo:** Để truy vấn min đoạn bất kỳ và cập nhật tự do, cần dùng hai cây Fenwick, xem thêm [Efficient Range Minimum Queries using Binary Indexed Trees](http://ioinformatics.org/oi/pdf/v9_2015_39_44.pdf).

---

## 8. Fenwick Tree hai chiều (2D)

```cpp
struct FenwickTree2D {
    vector<vector<int>> bit;
    int n, m;

    // init(...) { ... }

    int sum(int x, int y) {
        int ret = 0;
        for (int i = x; i >= 0; i = (i & (i + 1)) - 1)
            for (int j = y; j >= 0; j = (j & (j + 1)) - 1)
                ret += bit[i][j];
        return ret;
    }

    void add(int x, int y, int delta) {
        for (int i = x; i < n; i = i | (i + 1))
            for (int j = y; j < m; j = j | (j + 1))
                bit[i][j] += delta;
    }
};
```

---

## 9. Cài đặt one-based (chỉ số từ 1)

- $g(i) = i - (i \& -i)$
- $h(i) = i + (i \& -i)$

```cpp
struct FenwickTreeOneBasedIndexing {
    vector<int> bit;  // binary indexed tree
    int n;

    FenwickTreeOneBasedIndexing(int n) {
        this->n = n + 1;
        bit.assign(n + 1, 0);
    }

    FenwickTreeOneBasedIndexing(vector<int> a)
        : FenwickTreeOneBasedIndexing(a.size()) {
        for (size_t i = 0; i < a.size(); i++)
            add(i, a[i]);
    }

    int sum(int idx) {
        int ret = 0;
        for (++idx; idx > 0; idx -= idx & -idx)
            ret += bit[idx];
        return ret;
    }

    int sum(int l, int r) {
        return sum(r) - sum(l - 1);
    }

    void add(int idx, int delta) {
        for (++idx; idx < n; idx += idx & -idx)
            bit[idx] += delta;
    }
};
```

---

## 10. Các phép toán mở rộng

### 10.1. Point Update và Range Query

- Đây là Fenwick Tree cơ bản.

### 10.2. Range Update và Point Query

- Để tăng đoạn $[l, r]$ lên $x$, thực hiện `add(l, x)` và `add(r+1, -x)`.
- Để truy vấn giá trị tại $i$, lấy prefix sum tại $i$.

```cpp
void add(int idx, int val) {
    for (++idx; idx < n; idx += idx & -idx)
        bit[idx] += val;
}

void range_add(int l, int r, int val) {
    add(l, val);
    add(r + 1, -val);
}

int point_query(int idx) {
    int ret = 0;
    for (++idx; idx > 0; idx -= idx & -idx)
        ret += bit[idx];
    return ret;
}
```

### 10.3. Range Update và Range Query

- Dùng hai cây Fenwick $B_1$ và $B_2$.
- Khi tăng đoạn $[l, r]$ lên $x$:
    - `add(B1, l, x)`; `add(B1, r+1, -x)`
    - `add(B2, l, x*(l-1))`; `add(B2, r+1, -x*r)`
- Để truy vấn tổng đoạn $[l, r]$:
    - `prefix_sum(i) = sum(B1, i)*i - sum(B2, i)`
    - `range_sum(l, r) = prefix_sum(r) - prefix_sum(l-1)`

---

## 11. Bài tập luyện tập
- [UVA 12086 - Potentiometers](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=24&page=show_problem&problem=3238)
- [LOJ 1112 - Curious Robin Hood](http://www.lightoj.com/volume_showproblem.php?problem=1112)
- [LOJ 1266 - Points in Rectangle](http://www.lightoj.com/volume_showproblem.php?problem=1266)
- [Codechef - SPREAD](http://www.codechef.com/problems/SPREAD)
- [SPOJ - CTRICK](http://www.spoj.com/problems/CTRICK/)
- [SPOJ - MATSUM](http://www.spoj.com/problems/MATSUM/)
- [SPOJ - DQUERY](http://www.spoj.com/problems/DQUERY/)
- [SPOJ - NKTEAM](http://www.spoj.com/problems/NKTEAM/)
- [SPOJ - YODANESS](http://www.spoj.com/problems/YODANESS/)
- [SRM 310 - FloatingMedian](https://community.topcoder.com/stat?c=problem_statement&pm=6551&rd=9990)
- [SPOJ - Ada and Behives](http://www.spoj.com/problems/ADABEHIVE/)
- [Hackerearth - Counting in Byteland](https://www.hackerearth.com/practice/data-structures/advanced-data-structures/fenwick-binary-indexed-trees/practice-problems/algorithm/counting-in-byteland/)
- [DevSkill - Shan and String (archived)](http://web.archive.org/web/20210322010617/https://devskill.com/CodingProblems/ViewProblem/300)
- [Codeforces - Little Artem and Time Machine](http://codeforces.com/contest/669/problem/E)
- [Codeforces - Hanoi Factory](http://codeforces.com/contest/777/problem/E)
- [SPOJ - Tulip and Numbers](http://www.spoj.com/problems/TULIPNUM/)
- [SPOJ - SUMSUM](http://www.spoj.com/problems/SUMSUM/)
- [SPOJ - Sabir and Gifts](http://www.spoj.com/problems/SGIFT/)
- [SPOJ - The Permutation Game Again](http://www.spoj.com/problems/TPGA/)
- [SPOJ - Zig when you Zag](http://www.spoj.com/problems/ZIGZAG2/)
- [SPOJ - Cryon](http://www.spoj.com/problems/CRAYON/)
- [SPOJ - Weird Points](http://www.spoj.com/problems/DCEPC705/)
- [SPOJ - Its a Murder](http://www.spoj.com/problems/DCEPC206/)
- [SPOJ - Bored of Suffixes and Prefixes](http://www.spoj.com/problems/KOPC12G/)
- [SPOJ - Mega Inversions](http://www.spoj.com/problems/TRIPINV/)
- [Codeforces - Subsequences](http://codeforces.com/contest/597/problem/C)
- [Codeforces - Ball](http://codeforces.com/contest/12/problem/D)
- [GYM - The Kamphaeng Phet's Chedis](http://codeforces.com/gym/101047/problem/J)
- [Codeforces - Garlands](http://codeforces.com/contest/707/problem/E)
- [Codeforces - Inversions after Shuffle](http://codeforces.com/contest/749/problem/E)
- [GYM - Cairo Market](http://codeforces.com/problemset/gymProblem/101055/D)
- [Codeforces - Goodbye Souvenir](http://codeforces.com/contest/849/problem/E)
- [SPOJ - Ada and Species](http://www.spoj.com/problems/ADACABAA/)
- [Codeforces - Thor](https://codeforces.com/problemset/problem/704/A)
- [CSES - Forest Queries II](https://cses.fi/problemset/task/1739/)
- [Latin American Regionals 2017 - Fundraising](http://matcomgrader.com/problem/9346/fundraising/)

---

## 12. Tham khảo
- [Bản gốc tiếng Anh trên CP-Algorithms](https://cp-algorithms.com/data_structures/fenwick.html)
- Bản quyền: [CC BY-SA 4.0](https://github.com/cp-algorithms/cp-algorithms/blob/main/LICENSE)
- [Fenwick tree trên Wikipedia](http://en.wikipedia.org/wiki/Fenwick_tree)
- [Binary indexed trees tutorial on TopCoder](https://www.topcoder.com/community/data-science/data-science-tutorials/binary-indexed-trees/)
- [Range updates and queries](https://programmingcontests.quora.com/Tutorial-Range-Updates-in-Fenwick-Tree)

---

*Dịch và biên soạn bởi CacBaiDocThuatToan*
