# Logarit rời rạc (Discrete Logarithm)

## Giới thiệu

**Logarit rời rạc** là số nguyên $x$ thỏa mãn phương trình:

$$a^x \equiv b \pmod m$$

với các số nguyên $a$, $b$, $m$ cho trước.

Logarit rời rạc không phải lúc nào cũng tồn tại, ví dụ không có nghiệm cho $2^x \equiv 3 \pmod 7$. Không có điều kiện đơn giản nào để xác định khi nào logarit rời rạc tồn tại.

Bài này trình bày **thuật toán Baby-step Giant-step** (Shanks, 1971) để tính logarit rời rạc với độ phức tạp $O(\sqrt{m})$. Đây là một thuật toán "meet-in-the-middle" (gặp ở giữa) nhờ tách bài toán thành hai nửa.

## Thuật toán Baby-step Giant-step

Xét phương trình:

$$a^x \equiv b \pmod m$$

Giả sử $a$ và $m$ nguyên tố cùng nhau.

Ta đặt $x = np - q$, với $n$ là một hằng số chọn trước (sẽ chọn tối ưu sau), $p$ gọi là giant step, $q$ là baby step.

Mọi số $x$ trong $[0, m)$ đều có thể biểu diễn dạng này với $p \in [1, \lceil m/n \rceil]$, $q \in [0, n]$.

Thay vào phương trình:

$$a^{np - q} \equiv b \pmod m$$

Suy ra:

$$a^{np} \equiv b a^q \pmod m$$

Đặt:
- $f_1(p) = a^{np} \bmod m$
- $f_2(q) = b a^q \bmod m$

Bài toán trở thành tìm $p, q$ sao cho $f_1(p) = f_2(q)$.

### Các bước thực hiện

1. Tính $f_1(p)$ cho mọi $p$, lưu vào bảng (map hoặc mảng), sắp xếp theo giá trị.
2. Với mọi $q$, tính $f_2(q)$ và tìm kiếm nhị phân trong bảng $f_1$ để tìm $p$ phù hợp.

### Độ phức tạp

- Tính $f_1(p)$ và $f_2(q)$ đều $O(\log m)$ nhờ lũy thừa nhị phân.
- Tổng thể: $O(\sqrt{m} \log m)$ nếu chọn $n = \sqrt{m}$ tối ưu.

## Cài đặt cơ bản (C++)

```cpp
int powmod(int a, int b, int m) {
    int res = 1;
    while (b > 0) {
        if (b & 1) res = (res * 1ll * a) % m;
        a = (a * 1ll * a) % m;
        b >>= 1;
    }
    return res;
}

// Tìm x nhỏ nhất thỏa a^x ≡ b (mod m), a và m nguyên tố cùng nhau
int discrete_log(int a, int b, int m) {
    a %= m, b %= m;
    int n = sqrt(m) + 1;
    map<int, int> vals;
    for (int p = 1; p <= n; ++p)
        vals[powmod(a, p * n, m)] = p;
    for (int q = 0; q <= n; ++q) {
        int cur = (powmod(a, q, m) * 1ll * b) % m;
        if (vals.count(cur)) {
            int ans = vals[cur] * n - q;
            return ans;
        }
    }
    return -1;
}
```

### Lưu ý đặc biệt
- Nếu $a = 0$, cần xử lý riêng: $0^x \equiv b \pmod m$ chỉ có nghiệm nếu $b = 0$ hoặc $b = 1$ (tùy quy ước $0^0$).
- Nếu có nhiều nghiệm, hàm trên trả về một nghiệm bất kỳ.

## Cải tiến: Sử dụng unordered_map và giảm số phép tính lũy thừa

```cpp
// Trả về x nhỏ nhất thỏa a^x ≡ b (mod m), a và m nguyên tố cùng nhau
int discrete_log(int a, int b, int m) {
    a %= m, b %= m;
    int n = sqrt(m) + 1;
    int an = 1;
    for (int i = 0; i < n; ++i)
        an = (an * 1ll * a) % m;
    unordered_map<int, int> vals;
    for (int q = 0, cur = b; q <= n; ++q) {
        vals[cur] = q;
        cur = (cur * 1ll * a) % m;
    }
    for (int p = 1, cur = 1; p <= n; ++p) {
        cur = (cur * 1ll * an) % m;
        if (vals.count(cur)) {
            int ans = n * p - vals[cur];
            return ans;
        }
    }
    return -1;
}
```

- Độ phức tạp: $O(\sqrt{m})$ nhờ unordered_map.

## Trường hợp $a$ và $m$ không nguyên tố cùng nhau

Gọi $g = \gcd(a, m)$.
- Nếu $g \nmid b$ thì không có nghiệm.
- Nếu $g \mid b$, đặt $a = g\alpha, b = g\beta, m = g\nu$ và quy về bài toán nhỏ hơn.

Cài đặt tổng quát:

```cpp
// Trả về x nhỏ nhất thỏa a^x ≡ b (mod m)
int discrete_log(int a, int b, int m) {
    a %= m, b %= m;
    int k = 1, add = 0, g;
    while ((g = gcd(a, m)) > 1) {
        if (b == k) return add;
        if (b % g) return -1;
        b /= g, m /= g, ++add;
        k = (k * 1ll * a / g) % m;
    }
    int n = sqrt(m) + 1;
    int an = 1;
    for (int i = 0; i < n; ++i)
        an = (an * 1ll * a) % m;
    unordered_map<int, int> vals;
    for (int q = 0, cur = b; q <= n; ++q) {
        vals[cur] = q;
        cur = (cur * 1ll * a) % m;
    }
    for (int p = 1, cur = k; p <= n; ++p) {
        cur = (cur * 1ll * an) % m;
        if (vals.count(cur)) {
            int ans = n * p - vals[cur] + add;
            return ans;
        }
    }
    return -1;
}
```

- Độ phức tạp vẫn là $O(\sqrt{m})$.

## Ví dụ minh họa

### Ví dụ 1
Tìm $x$ nhỏ nhất thỏa $3^x \equiv 13 \pmod{17}$.

- $a = 3$, $b = 13$, $m = 17$
- Nghiệm nhỏ nhất là $x = 4$ vì $3^4 = 81 \equiv 13 \pmod{17}$

### Ví dụ 2
Tìm $x$ nhỏ nhất thỏa $2^x \equiv 3 \pmod{7}$.

- Không có nghiệm vì $2^x$ chỉ nhận các giá trị $1, 2, 4$ modulo 7.

### Ví dụ 3
Tìm $x$ nhỏ nhất thỏa $10^x \equiv 5 \pmod{21}$.

- $\gcd(10, 21) = 1$, áp dụng thuật toán bình thường.

## Bài tập thực hành

1. Tìm $x$ nhỏ nhất thỏa $5^x \equiv 243 \pmod{1009}$.
2. Tìm $x$ nhỏ nhất thỏa $7^x \equiv 1 \pmod{13}$.
3. Tìm $x$ nhỏ nhất thỏa $2^x \equiv 1024 \pmod{10007}$.
4. Tìm $x$ nhỏ nhất thỏa $a^x \equiv b \pmod{m}$ với $a, b, m$ cho trước.
5. Viết hàm Python giải bài toán logarit rời rạc tổng quát.

## Tham khảo

1. [CP-Algorithms: Discrete Logarithm](https://cp-algorithms.com/algebra/discrete-log.html)
2. [Wikipedia - Baby-step giant-step](https://en.wikipedia.org/wiki/Baby-step_giant-step)
3. [StackExchange: Zander's answer](https://math.stackexchange.com/a/133054)

## Lưu ý
- Bài toán logarit rời rạc là nền tảng của nhiều hệ mật mã hiện đại (ví dụ: Diffie-Hellman, ElGamal).
- Độ phức tạp $O(\sqrt{m})$ là tốt nhất với thuật toán tổng quát hiện nay.
- Có thể tối ưu thêm với các trường hợp đặc biệt (modulo là số nguyên tố, có căn nguyên thủy, ...).

## Tổng kết

- Logarit rời rạc là bài toán quan trọng trong lý thuyết số và mật mã học.
- Thuật toán Baby-step Giant-step cho phép giải quyết hiệu quả với $m$ không quá lớn.
- Hiểu rõ các trường hợp đặc biệt giúp áp dụng đúng và tối ưu hóa thuật toán.