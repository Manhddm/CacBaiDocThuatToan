# Căn bậc rời rạc (Discrete Root)

## Định nghĩa

Bài toán căn bậc rời rạc là: Cho các số nguyên $k, a, n$ với $n$ là số nguyên tố, tìm tất cả các số nguyên $x$ thỏa mãn:

$$x^k \equiv a \pmod n$$

Nói cách khác, tìm tất cả các căn bậc $k$ của $a$ modulo $n$.

## Điều kiện tồn tại nghiệm

- Nếu $a = 0$, nghiệm duy nhất là $x = 0$.
- Nếu $a \neq 0$, phương trình có nghiệm khi và chỉ khi $a$ là $k$-th power residue modulo $n$ (tức tồn tại $x$ sao cho $x^k \equiv a \pmod n$).

## Ý tưởng giải thuật

1. Nếu $a = 0$, trả về $x = 0$.
2. Nếu $\gcd(a, n) \neq 1$, không có nghiệm (trừ trường hợp $a = 0$).
3. Nếu $n$ là số nguyên tố, nhóm các số nguyên tố cùng nhau với $n$ tạo thành nhóm cyclic, có căn nguyên thủy $g$ modulo $n$.
4. Đặt $a = g^t$ với $t \in [0, n-2]$ (tìm $t$ bằng logarit rời rạc).
5. Phương trình $x^k \equiv a \pmod n$ tương đương $x \equiv g^y \pmod n$ với $k y \equiv t \pmod{n-1}$.
6. Giải phương trình đồng dư tuyến tính $k y \equiv t \pmod{n-1}$ để tìm tất cả $y$.
7. Với mỗi $y$ tìm được, $x = g^y \pmod n$ là một nghiệm.

## Thuật toán chi tiết

1. Tìm căn nguyên thủy $g$ modulo $n$.
2. Tìm $t$ sao cho $g^t \equiv a \pmod n$ (logarit rời rạc).
3. Giải phương trình $k y \equiv t \pmod{n-1}$ (sử dụng thuật toán Euclid mở rộng).
4. Với mỗi $y$ tìm được, tính $x = g^y \pmod n$.
5. Trả về tất cả các nghiệm $x$ (loại trùng lặp).

## Cài đặt (C++)

```cpp
int powmod(int a, int b, int mod) {
    int res = 1;
    while (b) {
        if (b & 1) res = 1LL * res * a % mod;
        a = 1LL * a * a % mod;
        b >>= 1;
    }
    return res;
}

// Tìm căn nguyên thủy nhỏ nhất modulo n (n là số nguyên tố)
int primitive_root(int n) {
    vector<int> fact;
    int phi = n - 1, m = phi;
    for (int i = 2; i * i <= m; ++i) {
        if (m % i == 0) {
            fact.push_back(i);
            while (m % i == 0) m /= i;
        }
    }
    if (m > 1) fact.push_back(m);
    for (int res = 2; res <= n; ++res) {
        bool ok = true;
        for (size_t i = 0; i < fact.size() && ok; ++i)
            ok &= powmod(res, phi / fact[i], n) != 1;
        if (ok) return res;
    }
    return -1;
}

// Thuật toán logarit rời rạc: tìm x nhỏ nhất thỏa a^x ≡ b (mod m)
int discrete_log(int a, int b, int m) {
    a %= m, b %= m;
    int n = sqrt(m) + 1;
    unordered_map<int, int> vals;
    for (int p = 1, cur = 1; p <= n; ++p) {
        cur = 1LL * cur * a % m;
        vals[cur] = p;
    }
    for (int q = 0, cur = b; q <= n; ++q) {
        if (vals.count(cur)) {
            int ans = vals[cur] * n - q;
            if (ans < m) return ans;
        }
        cur = 1LL * cur * a % m;
    }
    return -1;
}

// Giải phương trình k*y ≡ t (mod mod), trả về tất cả nghiệm y
vector<int> solve_congruence(int k, int t, int mod) {
    int g = __gcd(k, mod);
    if (t % g) return {};
    k /= g; t /= g; mod /= g;
    int inv_k = powmod(k, mod - 2, mod);
    int y0 = 1LL * inv_k * t % mod;
    vector<int> res;
    for (int i = 0; i < g; ++i)
        res.push_back((y0 + 1LL * i * mod) % (mod * g));
    return res;
}

// Tìm tất cả nghiệm x thỏa x^k ≡ a (mod n)
vector<int> discrete_root(int k, int a, int n) {
    if (a == 0) return {0};
    int g = primitive_root(n);
    int t = discrete_log(powmod(g, k, n), a, n);
    if (t == -1) return {};
    vector<int> y = solve_congruence(k, t, n - 1);
    vector<int> res;
    for (int i = 0; i < y.size(); ++i)
        res.push_back(powmod(g, y[i], n));
    sort(res.begin(), res.end());
    res.erase(unique(res.begin(), res.end()), res.end());
    return res;
}
```

## Ví dụ minh họa

### Ví dụ 1
Tìm tất cả $x$ thỏa $x^2 \equiv 4 \pmod{7}$.
- $n = 7$ là số nguyên tố, $k = 2$, $a = 4$.
- Các nghiệm: $x = 2, 5$ vì $2^2 = 4$, $5^2 = 25 \equiv 4 \pmod{7}$.

### Ví dụ 2
Tìm tất cả $x$ thỏa $x^3 \equiv 2 \pmod{5}$.
- $n = 5$, $k = 3$, $a = 2$.
- Các nghiệm: $x = 3$ vì $3^3 = 27 \equiv 2 \pmod{5}$.

## Bài tập thực hành

1. Tìm tất cả $x$ thỏa $x^4 \equiv 16 \pmod{17}$.
2. Tìm tất cả $x$ thỏa $x^5 \equiv 1 \pmod{11}$.
3. Tìm tất cả $x$ thỏa $x^2 \equiv 10 \pmod{13}$.
4. Viết hàm Python giải bài toán căn bậc rời rạc tổng quát.

## Tham khảo

1. [CP-Algorithms: Discrete Root](https://cp-algorithms.com/algebra/discrete-root.html)
2. [Wikipedia - Modular root](https://en.wikipedia.org/wiki/Modular_root)
3. [Primitive Root](https://cp-algorithms.com/algebra/primitive-root.html)
4. [Discrete Logarithm](https://cp-algorithms.com/algebra/discrete-log.html)

## Lưu ý
- Bài toán căn bậc rời rạc là tổng quát hóa của bài toán căn bậc hai modulo.
- Không phải lúc nào cũng có nghiệm.
- Ứng dụng trong mật mã học, lý thuyết số, giải phương trình đa thức modulo.

## Tổng kết
- Căn bậc rời rạc là bài toán quan trọng trong lý thuyết số và mật mã học.
- Có thể giải hiệu quả khi modulo là số nguyên tố nhờ logarit rời rạc và căn nguyên thủy.
- Hiểu rõ thuật toán giúp giải quyết nhiều bài toán tổ hợp và mã hóa.