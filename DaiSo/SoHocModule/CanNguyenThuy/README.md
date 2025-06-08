# Căn nguyên thủy (Primitive Root)

## Định nghĩa

Trong số học mô-đun, một số $g$ được gọi là **căn nguyên thủy modulo $n$** nếu mọi số nguyên tố cùng nhau với $n$ đều đồng dư với một lũy thừa của $g$ modulo $n$. Nói cách khác, $g$ là căn nguyên thủy modulo $n$ nếu với mọi $a$ sao cho $\gcd(a, n) = 1$, tồn tại $k$ để:

$$g^k \equiv a \pmod n$$

Khi đó, $k$ được gọi là **chỉ số** (index) hoặc **logarit rời rạc** của $a$ cơ số $g$ modulo $n$. $g$ còn được gọi là **bộ sinh** (generator) của nhóm các số nguyên modulo $n$.

Đặc biệt, khi $n$ là số nguyên tố, các lũy thừa của căn nguyên thủy sẽ chạy qua tất cả các số từ $1$ đến $n-1$.

## Điều kiện tồn tại căn nguyên thủy

Căn nguyên thủy modulo $n$ tồn tại **nếu và chỉ nếu**:
- $n$ là $1$, $2$, $4$;
- $n$ là lũy thừa của một số nguyên tố lẻ $(n = p^k)$;
- $n$ là $2$ nhân với lũy thừa của một số nguyên tố lẻ $(n = 2p^k)$.

Định lý này được Gauss chứng minh năm 1801.

## Liên hệ với hàm Euler

Nếu $g$ là căn nguyên thủy modulo $n$, thì số nhỏ nhất $k$ sao cho $g^k \equiv 1 \pmod n$ chính là $\varphi(n)$ (hàm Euler). Ngược lại, nếu $g^{\varphi(n)} \equiv 1$ và không có số mũ nhỏ hơn thỏa mãn, thì $g$ là căn nguyên thủy.

Số lượng căn nguyên thủy modulo $n$ (nếu tồn tại) là $\varphi(\varphi(n))$.

## Thuật toán tìm căn nguyên thủy

### Ý tưởng

- Tìm $\varphi(n)$ và phân tích thừa số nguyên tố của nó.
- Duyệt qua các số $g$ từ $2$ đến $n$:
    - Với mỗi $g$, kiểm tra $g^{\frac{\varphi(n)}{p_i}} \not\equiv 1 \pmod n$ với mọi thừa số nguyên tố $p_i$ của $\varphi(n)$.
    - Nếu đúng với mọi $p_i$, $g$ là căn nguyên thủy.

### Giải thích

Theo định lý Lagrange, chỉ cần kiểm tra các $d = \frac{\varphi(n)}{p_i}$ với $p_i$ là thừa số nguyên tố của $\varphi(n)$.

### Độ phức tạp

- $O(\varphi(n) \cdot \log \varphi(n) \cdot \log n)$ (với $n$ là số nguyên tố thì $\varphi(n) = n-1$)

## Cài đặt (C++)

```cpp
int powmod(int a, int b, int p) {
    int res = 1;
    while (b) {
        if (b & 1) res = int(res * 1ll * a % p), --b;
        else a = int(a * 1ll * a % p), b >>= 1;
    }
    return res;
}

// Tìm căn nguyên thủy nhỏ nhất modulo p (p là số nguyên tố)
int primitive_root(int p) {
    vector<int> fact;
    int phi = p - 1, n = phi;
    for (int i = 2; i * i <= n; ++i) {
        if (n % i == 0) {
            fact.push_back(i);
            while (n % i == 0) n /= i;
        }
    }
    if (n > 1) fact.push_back(n);
    for (int res = 2; res <= p; ++res) {
        bool ok = true;
        for (size_t i = 0; i < fact.size() && ok; ++i)
            ok &= powmod(res, phi / fact[i], p) != 1;
        if (ok) return res;
    }
    return -1;
}
```

- Nếu muốn áp dụng cho $n$ bất kỳ, cần thay $p-1$ bằng $\varphi(n)$.

## Ví dụ minh họa

### Ví dụ 1
Tìm căn nguyên thủy nhỏ nhất modulo $7$.
- $\varphi(7) = 6$, các thừa số nguyên tố: $2, 3$.
- Kiểm tra $g = 2$:
    - $2^{6/2} = 2^3 = 8 \equiv 1 \pmod{7}$ (loại)
- Kiểm tra $g = 3$:
    - $3^{3} = 27 \equiv 6 \not\equiv 1$
    - $3^{2} = 9 \equiv 2 \not\equiv 1$
- Vậy $g = 3$ là căn nguyên thủy nhỏ nhất modulo $7$.

### Ví dụ 2
Tìm tất cả căn nguyên thủy modulo $5$.
- $\varphi(5) = 4$, các thừa số nguyên tố: $2$.
- Các $g$ thỏa mãn: $g^{2} \not\equiv 1 \pmod{5}$.
- $g = 2$: $2^2 = 4 \not\equiv 1$
- $g = 3$: $3^2 = 9 \equiv 4 \not\equiv 1$
- $g = 4$: $4^2 = 16 \equiv 1$ (loại)
- Vậy các căn nguyên thủy là $2, 3$.

## Ứng dụng

- Tìm bộ sinh cho nhóm nhân modulo $n$.
- Tính logarit rời rạc (Discrete Logarithm).
- Mã hóa Diffie-Hellman, ElGamal, các hệ mật mã dựa trên nhóm cyclic.
- Tối ưu thuật toán FFT số nguyên (NTT).

## Bài tập thực hành

1. Tìm căn nguyên thủy nhỏ nhất modulo $17$.
2. Liệt kê tất cả căn nguyên thủy modulo $11$.
3. Kiểm tra số $g$ có phải căn nguyên thủy modulo $p$ với $p$ nguyên tố.
4. Tìm bộ sinh cho nhóm nhân modulo $p^k$ với $p$ lẻ.
5. Ứng dụng căn nguyên thủy để giải bài toán logarit rời rạc.

## Tham khảo

1. [CP-Algorithms: Primitive Root](https://cp-algorithms.com/algebra/primitive-root.html)
2. [Wikipedia - Primitive root modulo n](https://en.wikipedia.org/wiki/Primitive_root_modulo_n)
3. [Euler's totient function](https://cp-algorithms.com/algebra/phi-function.html)

## Lưu ý
- Không phải mọi $n$ đều có căn nguyên thủy.
- Số lượng căn nguyên thủy là $\varphi(\varphi(n))$ nếu tồn tại.
- Căn nguyên thủy rất quan trọng trong lý thuyết số, mật mã học và thuật toán.

## Tổng kết
- Căn nguyên thủy là bộ sinh mạnh nhất của nhóm nhân modulo $n$.
- Có thuật toán hiệu quả để kiểm tra và tìm căn nguyên thủy khi $n$ là số nguyên tố hoặc dạng đặc biệt.
- Ứng dụng rộng rãi trong toán học, lập trình thi đấu và bảo mật.