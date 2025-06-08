# Nhân Montgomery (Montgomery Multiplication)

## Giới thiệu

Nhiều thuật toán trong lý thuyết số như [kiểm tra số nguyên tố](https://cp-algorithms.com/algebra/primality_tests.html), [phân tích thừa số nguyên](https://cp-algorithms.com/algebra/factorization.html), và trong mật mã học như RSA, cần thực hiện rất nhiều phép toán modulo với số lớn. Phép nhân $x \cdot y \bmod n$ thường khá chậm với các thuật toán thông thường do phải chia để lấy phần dư, mà phép chia là phép toán tốn kém, đặc biệt với số lớn.

**Nhân Montgomery** là một phương pháp cho phép thực hiện phép nhân modulo nhanh hơn. Thay vì chia để lấy dư, thuật toán này cộng thêm các bội của $n$ để triệt tiêu các bit thấp rồi chỉ cần loại bỏ các bit thấp đó.

## Biểu diễn Montgomery

Thuật toán Montgomery chỉ hoạt động trong không gian Montgomery. Ta cần biến đổi các số vào không gian này trước khi nhân, và sau khi tính toán xong mới chuyển kết quả về lại không gian thường.

- Chọn số nguyên dương $r \ge n$ sao cho $\gcd(n, r) = 1$. Thực tế, $r$ thường được chọn là $2^m$ để các phép toán chia, nhân, lấy dư với $r$ có thể thực hiện nhanh bằng phép dịch bit.
- Đại diện Montgomery của $x$ là $\bar{x} = x \cdot r \bmod n$.
- Việc chuyển đổi này tốn chi phí, nhưng chỉ cần thực hiện một lần cho mỗi số. Sau đó, mọi phép toán nhân đều rất nhanh trong không gian Montgomery.

Trong không gian Montgomery, các phép cộng, trừ, so sánh, gcd với $n$ đều thực hiện như bình thường. Tuy nhiên, phép nhân cần xử lý đặc biệt:

- Kết quả mong muốn: $\bar{x} * \bar{y} = \overline{x \cdot y} = (x \cdot y) \cdot r \bmod n$
- Nhưng phép nhân thông thường cho: $\bar{x} \cdot \bar{y} = (x \cdot y) \cdot r^2 \bmod n$
- Do đó, phép nhân trong không gian Montgomery được định nghĩa là: $\bar{x} * \bar{y} := \bar{x} \cdot \bar{y} \cdot r^{-1} \bmod n$

## Thuật toán Montgomery Reduction

Để nhân hai số trong không gian Montgomery, ta cần tính hiệu quả $x \cdot r^{-1} \bmod n$ (gọi là Montgomery reduction, hay REDC).

- Do $\gcd(n, r) = 1$, tồn tại $r^{-1}$ và $n'$ sao cho $r \cdot r^{-1} + n \cdot n' = 1$.
- $r^{-1}$ và $n'$ có thể tính bằng [thuật toán Euclid mở rộng](https://cp-algorithms.com/algebra/extended-euclid-algorithm.html).

Thuật toán REDC:

```cpp
function reduce(x):
    q = (x mod r) * n' mod r
    a = (x - q * n) / r
    if a < 0:
        a += n
    return a
```

Nếu chọn $r$ là lũy thừa của 2, các phép chia/lấy dư với $r$ có thể thực hiện bằng dịch bit.

Chuyển kết quả về không gian thường cũng dùng Montgomery reduction.

## Mẹo tính nghịch đảo nhanh

Để tính $n' = n^{-1} \bmod r$ nhanh, có thể dùng mẹo sau (dựa trên phương pháp Newton):

$$a \cdot x \equiv 1 \pmod{2^k} \implies a \cdot x \cdot (2 - a \cdot x) \equiv 1 \pmod{2^{2k}}$$

Bắt đầu với $x = 1$ là nghịch đảo của $a$ modulo $2^1$, lặp lại mẹo này sẽ nhân đôi số bit đúng của $x$ mỗi lần.

## Cài đặt (C++)

Ví dụ với số 128 bit (dùng GCC):

```cpp
using u64 = uint64_t;
using u128 = __uint128_t;
using i128 = __int128_t;

struct u256 {
    u128 high, low;
    static u256 mult(u128 x, u128 y) {
        u64 a = x >> 64, b = x;
        u64 c = y >> 64, d = y;
        u128 ac = (u128)a * c;
        u128 ad = (u128)a * d;
        u128 bc = (u128)b * c;
        u128 bd = (u128)b * d;
        u128 carry = (u128)(u64)ad + (u128)(u64)bc + (bd >> 64u);
        u128 high = ac + (ad >> 64u) + (bc >> 64u) + (carry >> 64u);
        u128 low = (ad << 64u) + (bc << 64u) + bd;
        return {high, low};
    }
};

struct Montgomery {
    Montgomery(u128 n) : mod(n), inv(1) {
        for (int i = 0; i < 7; i++)
            inv *= 2 - n * inv;
    }
    u128 init(u128 x) {
        x %= mod;
        for (int i = 0; i < 128; i++) {
            x <<= 1;
            if (x >= mod)
                x -= mod;
        }
        return x;
    }
    u128 reduce(u256 x) {
        u128 q = x.low * inv;
        i128 a = x.high - u256::mult(q, mod).high;
        if (a < 0)
            a += mod;
        return a;
    }
    u128 mult(u128 a, u128 b) {
        return reduce(u256::mult(a, b));
    }
    u128 mod, inv;
};
```

## Biến đổi nhanh vào không gian Montgomery

Có thể tối ưu chuyển số vào không gian Montgomery bằng cách nhân với $r^2$ thay vì dịch bit nhiều lần:

```cpp
struct Montgomery {
    Montgomery(u128 n) : mod(n), inv(1), r2(-n % n) {
        for (int i = 0; i < 7; i++)
            inv *= 2 - n * inv;
        for (int i = 0; i < 4; i++) {
            r2 <<= 1;
            if (r2 >= mod)
                r2 -= mod;
        }
        for (int i = 0; i < 5; i++)
            r2 = mult(r2, r2);
    }
    u128 init(u128 x) {
        return mult(x, r2);
    }
    u128 mod, inv, r2;
};
```

## Ứng dụng

- Tăng tốc phép nhân modulo lớn trong các thuật toán số học, mật mã (RSA, Diffie-Hellman, kiểm tra số nguyên tố, phân tích thừa số,...)
- Tối ưu hóa phép nhân trong FFT số nguyên (NTT)
- Các hệ thống cần thực hiện nhiều phép nhân modulo liên tiếp

## Bài tập thực hành

1. Cài đặt nhân Montgomery cho số 64 bit và kiểm tra với các số lớn.
2. So sánh tốc độ nhân Montgomery với phép nhân modulo thông thường.
3. Ứng dụng Montgomery multiplication trong thuật toán kiểm tra số nguyên tố Miller-Rabin.
4. Tìm hiểu cách tối ưu hóa chuyển đổi vào/ra không gian Montgomery.

## Tham khảo

1. [CP-Algorithms: Montgomery Multiplication](https://cp-algorithms.com/algebra/montgomery_multiplication.html)
2. [Wikipedia - Montgomery reduction](https://en.wikipedia.org/wiki/Montgomery_modular_multiplication)
3. [Extended Euclidean Algorithm](https://cp-algorithms.com/algebra/extended-euclid-algorithm.html)

## Lưu ý
- Montgomery multiplication chỉ thực sự hiệu quả khi thực hiện nhiều phép nhân modulo liên tiếp với cùng $n$.
- Cần chọn $r$ là lũy thừa của 2 lớn hơn $n$ và $\gcd(n, r) = 1$.
- Việc chuyển đổi vào/ra không gian Montgomery có thể tốn chi phí nếu chỉ thực hiện ít phép toán.

## Tổng kết
- Nhân Montgomery là kỹ thuật tối ưu hóa phép nhân modulo lớn, đặc biệt hữu ích trong mật mã và lý thuyết số.
- Hiểu rõ nguyên lý và cài đặt giúp tăng tốc các thuật toán số học phức tạp.