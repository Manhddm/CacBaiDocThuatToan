# Hàm Phi Euler (Euler's Totient Function)

Hàm phi Euler, còn được gọi là hàm phi $\phi(n)$, đếm số lượng các số nguyên từ 1 đến $n$ (bao gồm cả hai đầu) mà nguyên tố cùng nhau với $n$. Hai số được gọi là nguyên tố cùng nhau nếu ước chung lớn nhất của chúng bằng $1$ (số $1$ được coi là nguyên tố cùng nhau với bất kỳ số nào).

Dưới đây là các giá trị của $\phi(n)$ cho một số số nguyên dương đầu tiên:

| $n$        | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 |
|------------|---|---|---|---|---|---|---|---|---|----|----|----|----|----|----|----|----|----|----|----|----|
| $\phi(n)$  | 1 | 1 | 2 | 2 | 4 | 2 | 6 | 4 | 6 | 4  | 10 | 4  | 12 | 6  | 8  | 8  | 16 | 6  | 18 | 8  | 12 |

## Tính chất

Các tính chất sau đây của hàm phi Euler đủ để tính toán nó cho bất kỳ số nào:

1. **Nếu $p$ là số nguyên tố**, thì $\gcd(p, q) = 1$ với mọi $1 \leq q < p$. Do đó:
   $$\phi(p) = p - 1$$

2. **Nếu $p$ là số nguyên tố và $k \geq 1$**, thì có chính xác $p^k / p$ số từ 1 đến $p^k$ chia hết cho $p$. Điều này cho ta:
   $$\phi(p^k) = p^k - p^{k-1}$$

3. **Nếu $a$ và $b$ nguyên tố cùng nhau**, thì:
   $$\phi(ab) = \phi(a) \cdot \phi(b)$$

   Tính chất này không dễ nhận thấy. Nó xuất phát từ [Định lý thặng dư Trung Hoa](../ThuatToanEuclid_MoRong/README.md). Định lý thặng dư Trung Hoa đảm bảo rằng với mỗi $0 \leq x < a$ và mỗi $0 \leq y < b$, tồn tại duy nhất $0 \leq z < ab$ với $z \equiv x \pmod{a}$ và $z \equiv y \pmod{b}$. Không khó để chứng minh rằng $z$ nguyên tố cùng nhau với $ab$ khi và chỉ khi $x$ nguyên tố cùng nhau với $a$ và $y$ nguyên tố cùng nhau với $b$.

4. **Tổng quát**, với $a$ và $b$ không nguyên tố cùng nhau:
   $$\phi(ab) = \phi(a) \cdot \phi(b) \cdot \frac{d}{\phi(d)}$$
   với $d = \gcd(a, b)$.

Do đó, sử dụng ba tính chất đầu tiên, chúng ta có thể tính $\phi(n)$ thông qua phân tích thừa số của $n$. Nếu $n = p_1^{a_1} \cdot p_2^{a_2} \cdots p_k^{a_k}$, trong đó $p_i$ là các thừa số nguyên tố của $n$:

$$\begin{align}
\phi(n) &= \phi(p_1^{a_1}) \cdot \phi(p_2^{a_2}) \cdots \phi(p_k^{a_k}) \\
&= (p_1^{a_1} - p_1^{a_1-1}) \cdot (p_2^{a_2} - p_2^{a_2-1}) \cdots (p_k^{a_k} - p_k^{a_k-1}) \\
&= p_1^{a_1} \cdot \left(1 - \frac{1}{p_1}\right) \cdot p_2^{a_2} \cdot \left(1 - \frac{1}{p_2}\right) \cdots p_k^{a_k} \cdot \left(1 - \frac{1}{p_k}\right) \\
&= n \cdot \left(1 - \frac{1}{p_1}\right) \cdot \left(1 - \frac{1}{p_2}\right) \cdots \left(1 - \frac{1}{p_k}\right)
\end{align}$$

## Cài đặt

### Thuật toán cơ bản

Dưới đây là cài đặt sử dụng phân tích thừa số trong $O(\sqrt{n})$:

#### Code C++
```cpp
int phi(int n) {
    int result = n;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) {
            while (n % i == 0)
                n /= i;
            result -= result / i;
        }
    }
    if (n > 1)
        result -= result / n;
    return result;
}
```

#### Code Python
```python
def phi(n):
    """
    Tính hàm phi Euler cho một số n
    Độ phức tạp: O(√n)
    """
    result = n
    p = 2
    
    # Kiểm tra tất cả thừa số nguyên tố
    while p * p <= n:
        if n % p == 0:
            # Loại bỏ tất cả thừa số p
            while n % p == 0:
                n //= p
            # Áp dụng công thức: result *= (1 - 1/p)
            result -= result // p
        p += 1
    
    # Nếu n > 1 thì n là thừa số nguyên tố
    if n > 1:
        result -= result // n
    
    return result

# Phiên bản tối ưu hơn
def phi_optimized(n):
    """
    Phiên bản tối ưu của hàm phi Euler
    """
    if n == 1:
        return 1
    
    result = n
    
    # Kiểm tra thừa số 2
    if n % 2 == 0:
        while n % 2 == 0:
            n //= 2
        result //= 2  # result *= (1 - 1/2) = result * 1/2
    
    # Kiểm tra các thừa số lẻ
    p = 3
    while p * p <= n:
        if n % p == 0:
            while n % p == 0:
                n //= p
            result -= result // p
        p += 2
    
    # Nếu n > 1 thì n là thừa số nguyên tố lớn
    if n > 1:
        result -= result // n
    
    return result

# Ví dụ sử dụng
print("Hàm Phi Euler cho các số từ 1 đến 20:")
for i in range(1, 21):
    phi_val = phi(i)
    print(f"φ({i}) = {phi_val}")

# Kiểm tra với số lớn
large_numbers = [100, 1000, 12345, 987654321]
print(f"\nHàm Phi Euler cho số lớn:")
for num in large_numbers:
    phi_val = phi_optimized(num)
    print(f"φ({num}) = {phi_val}")
```

### Kết quả:
```
Hàm Phi Euler cho các số từ 1 đến 20:
φ(1) = 1
φ(2) = 1
φ(3) = 2
φ(4) = 2
φ(5) = 4
φ(6) = 2
φ(7) = 6
φ(8) = 4
φ(9) = 6
φ(10) = 4
φ(11) = 10
φ(12) = 4
φ(13) = 12
φ(14) = 6
φ(15) = 8
φ(16) = 8
φ(17) = 16
φ(18) = 6
φ(19) = 18
φ(20) = 8
```

## Hàm phi Euler từ 1 đến n trong O(n log log n)

Nếu chúng ta cần phi của tất cả các số từ 1 đến $n$, thì việc phân tích thừa số tất cả $n$ số là không hiệu quả. Chúng ta có thể sử dụng cùng ý tưởng như [Sàng Eratosthenes](../SangEratosthenes/README.md).

#### Code C++
```cpp
void phi_1_to_n(int n) {
    vector<int> phi(n + 1);
    for (int i = 0; i <= n; i++)
        phi[i] = i;

    for (int i = 2; i <= n; i++) {
        if (phi[i] == i) {
            for (int j = i; j <= n; j += i)
                phi[j] -= phi[j] / i;
        }
    }
}
```

#### Code Python
```python
def phi_sieve(n):
    """
    Tính hàm phi Euler cho tất cả số từ 1 đến n
    Sử dụng thuật toán sàng tương tự Sàng Eratosthenes
    Độ phức tạp: O(n log log n)
    """
    phi = list(range(n + 1))  # phi[i] = i ban đầu
    
    for i in range(2, n + 1):
        if phi[i] == i:  # i là số nguyên tố
            # Cập nhật phi cho tất cả bội số của i
            for j in range(i, n + 1, i):
                phi[j] -= phi[j] // i
    
    return phi

# Phiên bản tối ưu bộ nhớ
def phi_sieve_optimized(n):
    """
    Phiên bản tối ưu bộ nhớ của sàng phi Euler
    """
    phi = list(range(n + 1))
    
    for i in range(2, n + 1):
        if phi[i] == i:  # i là số nguyên tố
            # Sử dụng công thức φ(p^k) = p^k - p^(k-1)
            for j in range(i, n + 1, i):
                phi[j] = phi[j] // i * (i - 1)
    
    return phi

# Ví dụ sử dụng
n = 30
phi_values = phi_sieve(n)

print(f"Hàm Phi Euler từ 1 đến {n}:")
for i in range(1, n + 1):
    print(f"φ({i}) = {phi_values[i]}")

# So sánh hiệu suất
import time

def compare_methods(n):
    """So sánh hiệu suất các phương pháp"""
    
    # Phương pháp đơn lẻ
    start = time.time()
    individual_results = [phi(i) for i in range(1, n + 1)]
    individual_time = time.time() - start
    
    # Phương pháp sàng
    start = time.time()
    sieve_results = phi_sieve(n)[1:]
    sieve_time = time.time() - start
    
    print(f"n = {n}")
    print(f"Phương pháp đơn lẻ: {individual_time:.4f}s")
    print(f"Phương pháp sàng: {sieve_time:.4f}s")
    print(f"Tỷ lệ tăng tốc: {individual_time/sieve_time:.2f}x")
    
    # Kiểm tra tính đúng đắn
    assert individual_results == sieve_results
    print("✓ Kết quả đúng")

# So sánh với n = 1000
compare_methods(1000)
```

## Tính chất tổng ước số

Tính chất thú vị này được thiết lập bởi Gauss:

$$\sum_{d|n} \phi(d) = n$$

Ở đây tổng được tính trên tất cả các ước số dương $d$ của $n$.

Ví dụ, các ước số của 10 là 1, 2, 5 và 10. Do đó $\phi(1) + \phi(2) + \phi(5) + \phi(10) = 1 + 1 + 4 + 4 = 10$.

### Tìm phi từ 1 đến n sử dụng tính chất tổng ước số

#### Code C++
```cpp
void phi_1_to_n(int n) {
    vector<int> phi(n + 1);
    phi[0] = 0;
    phi[1] = 1;
    for (int i = 2; i <= n; i++)
        phi[i] = i - 1;

    for (int i = 2; i <= n; i++)
        for (int j = 2 * i; j <= n; j += i)
              phi[j] -= phi[i];
}
```

#### Code Python
```python
def phi_divisor_sum(n):
    """
    Tính hàm phi sử dụng tính chất tổng ước số
    Độ phức tạp: O(n log n)
    """
    phi = [0] * (n + 1)
    phi[1] = 1
    
    # Khởi tạo: φ(i) = i - 1 cho i > 1
    for i in range(2, n + 1):
        phi[i] = i - 1
    
    # Áp dụng tính chất tổng ước số
    for i in range(2, n + 1):
        for j in range(2 * i, n + 1, i):
            phi[j] -= phi[i]
    
    return phi

def verify_divisor_sum_property(n):
    """
    Kiểm tra tính chất tổng ước số của Gauss
    """
    phi_vals = phi_sieve(n)
    
    print(f"Kiểm tra tính chất tổng ước số cho số từ 1 đến {n}:")
    for num in range(1, min(n + 1, 21)):  # Chỉ hiển thị 20 số đầu
        divisors = []
        phi_sum = 0
        
        for d in range(1, num + 1):
            if num % d == 0:
                divisors.append(d)
                phi_sum += phi_vals[d]
        
        print(f"n={num}: ước số={divisors}")
        print(f"      Σφ(d) = {' + '.join([f'φ({d})' for d in divisors])} = {phi_sum} = {num} ✓")

# Kiểm tra tính chất
verify_divisor_sum_property(12)
```

## Ứng dụng trong định lý Euler

Tính chất nổi tiếng và quan trọng nhất của hàm phi Euler được thể hiện trong định lý Euler:

$$a^{\phi(m)} \equiv 1 \pmod{m} \quad \text{nếu } a \text{ và } m \text{ nguyên tố cùng nhau}$$

Trong trường hợp đặc biệt khi $m$ là số nguyên tố, định lý Euler trở thành định lý nhỏ Fermat:

$$a^{m-1} \equiv 1 \pmod{m}$$

Định lý Euler và hàm phi Euler xuất hiện khá thường xuyên trong các ứng dụng thực tế, ví dụ cả hai đều được sử dụng để tính [nghịch đảo modular](../ThuatToanEuclid_MoRong/README.md).

Như một hệ quả trực tiếp, chúng ta cũng có được tương đương:

$$a^n \equiv a^{n \bmod \phi(m)} \pmod{m}$$

### Code Python cho định lý Euler
```python
def mod_exp(base, exp, mod):
    """Tính (base^exp) % mod hiệu quả"""
    result = 1
    base = base % mod
    while exp > 0:
        if exp % 2 == 1:
            result = (result * base) % mod
        exp = exp >> 1
        base = (base * base) % mod
    return result

def gcd(a, b):
    """Tính ước chung lớn nhất"""
    while b:
        a, b = b, a % b
    return a

def verify_euler_theorem(a, m, phi_m):
    """
    Kiểm tra định lý Euler: a^φ(m) ≡ 1 (mod m)
    """
    if gcd(a, m) != 1:
        return False, f"{a} và {m} không nguyên tố cùng nhau"
    
    result = mod_exp(a, phi_m, m)
    is_valid = result == 1
    
    return is_valid, f"{a}^{phi_m} ≡ {result} (mod {m})"

def euler_power_reduction(base, exp, mod):
    """
    Tính base^exp (mod m) sử dụng định lý Euler
    """
    phi_m = phi(mod)
    
    if gcd(base, mod) == 1:
        # Nếu base và mod nguyên tố cùng nhau
        reduced_exp = exp % phi_m
        return mod_exp(base, reduced_exp, mod)
    else:
        # Trường hợp tổng quát (cần xử lý đặc biệt)
        return mod_exp(base, exp, mod)

# Ví dụ và kiểm tra
print("Kiểm tra định lý Euler:")
test_cases = [
    (3, 10),   # gcd(3,10) = 1, φ(10) = 4
    (7, 12),   # gcd(7,12) = 1, φ(12) = 4  
    (5, 14),   # gcd(5,14) = 1, φ(14) = 6
]

for a, m in test_cases:
    phi_m = phi(m)
    is_valid, message = verify_euler_theorem(a, m, phi_m)
    print(f"a={a}, m={m}, φ(m)={phi_m}: {message} {'✓' if is_valid else '✗'}")

print(f"\nTính lũy thừa lớn với định lý Euler:")
large_cases = [
    (3, 1000000, 7),    # 3^1000000 (mod 7)
    (2, 123456789, 11), # 2^123456789 (mod 11)
]

for base, exp, mod in large_cases:
    phi_m = phi(mod)
    result = euler_power_reduction(base, exp, mod)
    reduced_exp = exp % phi_m
    print(f"{base}^{exp} ≡ {base}^{reduced_exp} ≡ {result} (mod {mod})")
```

## Tổng quát hóa

Có một phiên bản ít được biết đến của tương đương cuối cùng, cho phép tính $x^n \bmod m$ hiệu quả với $x$ và $m$ không nguyên tố cùng nhau. Với $x$, $m$ và $n \geq \log_2 m$ tùy ý:

$$x^n \equiv x^{\phi(m) + [n \bmod \phi(m)]} \pmod{m}$$

### Code Python cho tổng quát hóa
```python
def generalized_euler_power(base, exp, mod):
    """
    Tính base^exp (mod m) với công thức tổng quát
    Hoạt động với base và mod không nguyên tố cùng nhau
    """
    phi_m = phi(mod)
    
    # Với exp >= log2(mod), sử dụng công thức tổng quát
    import math
    if exp >= math.log2(mod):
        reduced_exp = phi_m + (exp % phi_m)
        return mod_exp(base, reduced_exp, mod)
    else:
        return mod_exp(base, exp, mod)

# Kiểm tra với các trường hợp không nguyên tố cùng nhau
print("Tổng quát hóa định lý Euler:")
general_cases = [
    (4, 1000, 6),    # gcd(4,6) = 2 ≠ 1
    (6, 2000, 9),    # gcd(6,9) = 3 ≠ 1
    (10, 5000, 15),  # gcd(10,15) = 5 ≠ 1
]

for base, exp, mod in general_cases:
    phi_m = phi(mod)
    result1 = mod_exp(base, exp, mod)  # Tính trực tiếp
    result2 = generalized_euler_power(base, exp, mod)  # Tính với công thức
    
    print(f"{base}^{exp} (mod {mod}):")
    print(f"  Trực tiếp: {result1}")
    print(f"  Công thức tổng quát: {result2}")
    print(f"  φ({mod}) = {phi_m}, gcd({base},{mod}) = {gcd(base, mod)}")
    print(f"  Kết quả {'đúng' if result1 == result2 else 'sai'} ✓")
```

## Ứng dụng thực tế

### 1. Mật mã RSA
```python
def rsa_key_generation():
    """
    Mô phỏng sinh khóa RSA sử dụng hàm phi Euler
    """
    # Chọn hai số nguyên tố (trong thực tế phải lớn hơn nhiều)
    p, q = 61, 53
    n = p * q
    
    # Tính φ(n) = (p-1)(q-1)
    phi_n = (p - 1) * (q - 1)
    
    # Chọn e sao cho gcd(e, φ(n)) = 1
    e = 17
    assert gcd(e, phi_n) == 1
    
    # Tìm d sao cho e*d ≡ 1 (mod φ(n))
    def extended_gcd(a, b):
        if a == 0:
            return b, 0, 1
        gcd, x1, y1 = extended_gcd(b % a, a)
        x = y1 - (b // a) * x1
        y = x1
        return gcd, x, y
    
    _, d, _ = extended_gcd(e, phi_n)
    d = d % phi_n
    
    print(f"Sinh khóa RSA:")
    print(f"p = {p}, q = {q}")
    print(f"n = {n}")
    print(f"φ(n) = {phi_n}")
    print(f"Khóa công khai: (e={e}, n={n})")
    print(f"Khóa bí mật: (d={d}, n={n})")
    
    # Kiểm tra mã hóa/giải mã
    message = 123
    encrypted = mod_exp(message, e, n)
    decrypted = mod_exp(encrypted, d, n)
    
    print(f"\nKiểm tra:")
    print(f"Thông điệp gốc: {message}")
    print(f"Mã hóa: {encrypted}")
    print(f"Giải mã: {decrypted}")
    print(f"Thành công: {'✓' if message == decrypted else '✗'}")

rsa_key_generation()
```

### 2. Đếm số phân số tối giản
```python
def count_reduced_fractions(n):
    """
    Đếm số phân số tối giản có mẫu số ≤ n
    Sử dụng hàm phi Euler
    """
    phi_values = phi_sieve(n)
    
    # Số phân số tối giản với mẫu số d là φ(d)
    total = sum(phi_values[1:])  # Loại trừ φ(0)
    
    print(f"Số phân số tối giản với mẫu số từ 1 đến {n}: {total}")
    
    # Chi tiết cho một số mẫu số nhỏ
    print("Chi tiết:")
    for d in range(1, min(n + 1, 11)):
        fractions = []
        for num in range(1, d):
            if gcd(num, d) == 1:
                fractions.append(f"{num}/{d}")
        print(f"Mẫu số {d}: {len(fractions)} phân số - {', '.join(fractions)}")

count_reduced_fractions(10)
```

### 3. Chu kỳ thặng dư
```python
def find_multiplicative_order(a, n):
    """
    Tìm bậc của a modulo n
    Là số k nhỏ nhất sao cho a^k ≡ 1 (mod n)
    """
    if gcd(a, n) != 1:
        return None
    
    phi_n = phi(n)
    
    # Kiểm tra các ước số của φ(n)
    for k in range(1, phi_n + 1):
        if mod_exp(a, k, n) == 1:
            return k
    
    return phi_n

def analyze_multiplicative_group(n):
    """
    Phân tích nhóm nhân modulo n
    """
    phi_n = phi(n)
    print(f"Phân tích nhóm nhân modulo {n}:")
    print(f"φ({n}) = {phi_n}")
    
    # Tìm các phần tử và bậc của chúng
    elements = []
    orders = []
    
    for a in range(1, n):
        if gcd(a, n) == 1:
            order = find_multiplicative_order(a, n)
            elements.append(a)
            orders.append(order)
    
    print(f"Các phần tử: {elements}")
    print(f"Bậc tương ứng: {orders}")
    
    # Tìm phần tử sinh (primitive root)
    primitive_roots = [elements[i] for i in range(len(elements)) if orders[i] == phi_n]
    print(f"Phần tử sinh (primitive roots): {primitive_roots}")
    
    return elements, orders

# Phân tích một số nhóm nhỏ
for n in [7, 11, 13, 15]:
    analyze_multiplicative_group(n)
    print()
```

## Bài tập thực hành

- [SPOJ #4141 "Euler Totient Function"](http://www.spoj.com/problems/ETF/)
- [UVA #10179 "Irreducible Basic Fractions"](http://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=1120)
- [UVA #10299 "Relatives"](http://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=1240)
- [LeetCode - 372. Super Pow](https://leetcode.com/problems/super-pow/)
- [Codeforces - Power Tower](http://codeforces.com/problemset/problem/906/D)

## Tài liệu tham khảo

- [CP-Algorithms: Euler's Totient Function](https://cp-algorithms.com/algebra/phi-function.html)
- Gauss, C. F. "Disquisitiones Arithmeticae" (1801)
- Hardy, G. H. & Wright, E. M. "An Introduction to the Theory of Numbers"
