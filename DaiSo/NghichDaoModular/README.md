# Nghịch đảo Modular (Modular Multiplicative Inverse)

## Định nghĩa

Nghịch đảo modular của một số nguyên $a$ là một số nguyên $x$ sao cho $a \cdot x$ đồng dư với $1$ theo modulo $m$. Nói cách khác, ta muốn tìm $x$ sao cho:

$$a \cdot x \equiv 1 \pmod{m}$$

Ký hiệu $x$ là $a^{-1}$.

Lưu ý: Nghịch đảo modular không phải lúc nào cũng tồn tại. Ví dụ, với $m = 4$, $a = 2$, không tồn tại $x$ thỏa mãn $2x \equiv 1 \pmod{4}$. Có thể chứng minh rằng nghịch đảo modular tồn tại khi và chỉ khi $a$ và $m$ nguyên tố cùng nhau ($\gcd(a, m) = 1$).

## Tìm nghịch đảo modular bằng Thuật toán Euclid mở rộng

Xét phương trình:

$$a \cdot x + m \cdot y = 1$$

Đây là một phương trình Diophantine tuyến tính hai ẩn. Khi $\gcd(a, m) = 1$, phương trình này có nghiệm, có thể tìm bằng thuật toán Euclid mở rộng. Khi đó, $x$ chính là nghịch đảo modular của $a$ modulo $m$.

Cài đặt:
```cpp
int x, y;
int g = extended_euclidean(a, m, x, y);
if (g != 1) {
    cout << "No solution!";
} else {
    x = (x % m + m) % m;
    cout << x << endl;
}
```
Lưu ý: $x$ có thể âm, nên cần chuẩn hóa về $[0, m-1]$.

## Tìm nghịch đảo modular bằng Lũy thừa nhị phân (Binary Exponentiation)

Theo định lý Euler: Nếu $a$ và $m$ nguyên tố cùng nhau:

$$a^{\phi(m)} \equiv 1 \pmod{m}$$

Với $\phi$ là hàm phi Euler. Nếu $m$ là số nguyên tố, ta có định lý Fermat nhỏ:

$$a^{m-1} \equiv 1 \pmod{m}$$

Suy ra:
- Với $m$ bất kỳ: $a^{\phi(m)-1} \equiv a^{-1} \pmod{m}$
- Với $m$ nguyên tố: $a^{m-2} \equiv a^{-1} \pmod{m}$

Có thể tính nhanh bằng thuật toán lũy thừa nhị phân $O(\log m)$.

## Tìm nghịch đảo modular cho modulo nguyên tố bằng chia Euclid

Với $m$ là số nguyên tố $> a$:

$$m = k \cdot a + r$$

Suy ra:

$$a^{-1} \equiv -k \cdot r^{-1} \pmod{m}$$

Cài đặt đệ quy (C++):
```cpp
int inv(int a) {
    return a <= 1 ? a : m - (long long)(m/a) * inv(m % a) % m;
}
```
Có thể tiền xử lý toàn bộ nghịch đảo từ $1$ đến $m-1$ trong $O(m)$:
```cpp
inv[1] = 1;
for(int a = 2; a < m; ++a)
    inv[a] = m - (long long)(m/a) * inv[m%a] % m;
```

## Tìm nghịch đảo modular cho mảng số

Cho mảng $a_1, a_2, ..., a_n$ (tất cả đều có nghịch đảo), có thể tính nghịch đảo từng phần tử hiệu quả bằng prefix/suffix product và chỉ cần tính một lần nghịch đảo tổng:

C++:
```cpp
std::vector<int> invs(const std::vector<int> &a, int m) {
    int n = a.size();
    if (n == 0) return {};
    std::vector<int> b(n);
    int v = 1;
    for (int i = 0; i != n; ++i) {
        b[i] = v;
        v = static_cast<long long>(v) * a[i] % m;
    }
    int x, y;
    extended_euclidean(v, m, x, y);
    x = (x % m + m) % m;
    for (int i = n - 1; i >= 0; --i) {
        b[i] = static_cast<long long>(x) * b[i] % m;
        x = static_cast<long long>(x) * a[i] % m;
    }
    return b;
}
```

## Bài tập thực hành
- [UVa 11904 - One Unit Machine](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=3055)
- [Hackerrank - Longest Increasing Subsequence Arrays](https://www.hackerrank.com/contests/world-codesprint-5/challenges/longest-increasing-subsequence-arrays)
- [Codeforces 300C - Beautiful Numbers](http://codeforces.com/problemset/problem/300/C)
- [Codeforces 622F - The Sum of the k-th Powers](http://codeforces.com/problemset/problem/622/F)
- [Codeforces 717A - Festival Organization](http://codeforces.com/problemset/problem/717/A)
- [Codeforces 896D - Nephren Runs a Cinema](http://codeforces.com/problemset/problem/896/D)

## Tài liệu tham khảo
- [CP-Algorithms: Modular Inverse](https://cp-algorithms.com/algebra/module-inverse.html)
- Wikipedia: [Modular multiplicative inverse](http://en.wikipedia.org/wiki/Modular_multiplicative_inverse)
- [Thuật toán Euclid mở rộng](https://cp-algorithms.com/algebra/extended-euclid-algorithm.html)
- [Hàm phi Euler](https://cp-algorithms.com/algebra/phi-function.html)
- [Lũy thừa nhị phân](https://cp-algorithms.com/algebra/binary-exp.html)
