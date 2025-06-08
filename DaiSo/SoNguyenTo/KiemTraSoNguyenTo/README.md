# Kiểm Tra Số Nguyên Tố (Primality Tests)

Bài viết này mô tả nhiều thuật toán để xác định xem một số có phải là số nguyên tố hay không.

## Thuật toán chia thử (Trial Division)

Theo định nghĩa, một số nguyên tố không có ước số nào khác ngoài $1$ và chính nó. Một số hợp có ít nhất một ước số bổ sung, gọi nó là $d$. Tự nhiên $\frac{n}{d}$ cũng là một ước số của $n$. Dễ thấy rằng hoặc $d \leq \sqrt{n}$ hoặc $\frac{n}{d} \leq \sqrt{n}$, do đó một trong các ước số $d$ và $\frac{n}{d}$ là $\leq \sqrt{n}$. Chúng ta có thể sử dụng thông tin này để kiểm tra tính nguyên tố.

Chúng ta cố gắng tìm một ước số không tầm thường, bằng cách kiểm tra xem có số nào từ $2$ đến $\sqrt{n}$ là ước số của $n$ hay không. Nếu nó là một ước số, thì $n$ chắc chắn không phải là số nguyên tố, nếu không thì nó là số nguyên tố.

### Code C++
```cpp
bool isPrime(int x) {
    for (int d = 2; d * d <= x; d++) {
        if (x % d == 0)
            return false;
    }
    return x >= 2;
}
```

### Code Python
```python
def is_prime_trial_division(n):
    """
    Kiểm tra số nguyên tố bằng thuật toán chia thử
    Độ phức tạp: O(√n)
    """
    if n < 2:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False
    
    # Kiểm tra các số lẻ từ 3 đến √n
    i = 3
    while i * i <= n:
        if n % i == 0:
            return False
        i += 2
    
    return True

# Phiên bản tối ưu hơn
import math

def is_prime_optimized(n):
    """
    Phiên bản tối ưu của thuật toán chia thử
    """
    if n < 2:
        return False
    if n == 2 or n == 3:
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    
    # Kiểm tra các số có dạng 6k±1
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    
    return True

# Ví dụ sử dụng
test_numbers = [2, 3, 4, 17, 25, 29, 97, 100, 101]
print("Kiểm tra số nguyên tố bằng thuật toán chia thử:")
for num in test_numbers:
    result = is_prime_trial_division(num)
    print(f"{num}: {'Nguyên tố' if result else 'Không phải nguyên tố'}")
```

Đây là dạng đơn giản nhất của kiểm tra nguyên tố. Bạn có thể tối ưu hàm này khá nhiều, ví dụ bằng cách chỉ kiểm tra tất cả các số lẻ trong vòng lặp, vì số nguyên tố chẵn duy nhất là 2.

## Kiểm tra nguyên tố Fermat

Đây là một kiểm tra xác suất.

Định lý nhỏ Fermat (xem thêm [Hàm phi Euler](../ThuatToanEuclid_MoRong/README.md)) nói rằng, đối với một số nguyên tố $p$ và một số nguyên $a$ nguyên tố cùng nhau với $p$, phương trình sau đúng:

$$a^{p-1} \equiv 1 \pmod{p}$$

Nói chung, định lý này không đúng với các số hợp.

Điều này có thể được sử dụng để tạo ra một kiểm tra nguyên tố. Chúng ta chọn một số nguyên $2 \leq a \leq p - 2$, và kiểm tra xem phương trình có đúng hay không. Nếu nó không đúng, ví dụ $a^{p-1} \not\equiv 1 \pmod{p}$, chúng ta biết rằng $p$ không thể là số nguyên tố. Trong trường hợp này, chúng ta gọi cơ số $a$ là một nhân chứng Fermat cho tính hợp của $p$.

Tuy nhiên, cũng có thể phương trình đúng với một số hợp. Vì vậy, nếu phương trình đúng, chúng ta không có bằng chứng về tính nguyên tố. Chúng ta chỉ có thể nói rằng $p$ có thể là nguyên tố. Nếu hóa ra số đó thực sự là hợp, chúng ta gọi cơ số $a$ là một kẻ nói dối Fermat.

### Code C++
```cpp
bool probablyPrimeFermat(int n, int iter=5) {
    if (n < 4)
        return n == 2 || n == 3;

    for (int i = 0; i < iter; i++) {
        int a = 2 + rand() % (n - 3);
        if (binpower(a, n - 1, n) != 1)
            return false;
    }
    return true;
}
```

### Code Python
```python
import random

def mod_exp(base, exp, mod):
    """
    Tính (base^exp) % mod một cách hiệu quả
    """
    result = 1
    base = base % mod
    while exp > 0:
        if exp % 2 == 1:
            result = (result * base) % mod
        exp = exp >> 1
        base = (base * base) % mod
    return result

def fermat_test(n, k=5):
    """
    Kiểm tra nguyên tố Fermat
    n: số cần kiểm tra
    k: số lần lặp (độ tin cậy)
    """
    if n < 4:
        return n == 2 or n == 3
    
    for _ in range(k):
        a = random.randint(2, n - 2)
        if mod_exp(a, n - 1, n) != 1:
            return False
    
    return True

# Ví dụ sử dụng
test_numbers = [17, 25, 29, 97, 561]  # 561 là số Carmichael
print("Kiểm tra số nguyên tố bằng kiểm tra Fermat:")
for num in test_numbers:
    result = fermat_test(num)
    print(f"{num}: {'Có thể nguyên tố' if result else 'Không phải nguyên tố'}")

# Kiểm tra số Carmichael 561 = 3 × 11 × 17
print(f"\n561 = 3 × 11 × 17 = {3 * 11 * 17}")
print("561 là số Carmichael - có thể qua được kiểm tra Fermat dù là số hợp")
```

Chúng ta sử dụng [Lũy thừa nhị phân](../LuyThuaNhiPhan/README.md) để tính toán hiệu quả lũy thừa $a^{p-1}$.

Tuy nhiên có một tin xấu: tồn tại một số số hợp mà $a^{n-1} \equiv 1 \pmod{n}$ đúng với tất cả $a$ nguyên tố cùng nhau với $n$, ví dụ số $561 = 3 \cdot 11 \cdot 17$. Những số như vậy được gọi là số Carmichael. Kiểm tra nguyên tố Fermat chỉ có thể nhận dạng những số này nếu chúng ta có may mắn lớn và chọn một cơ số $a$ với $\gcd(a, n) \neq 1$.

Kiểm tra Fermat vẫn được sử dụng trong thực tế, vì nó rất nhanh và số Carmichael rất hiếm. Ví dụ, chỉ có 646 số như vậy dưới $10^9$.

## Kiểm tra nguyên tố Miller-Rabin

Kiểm tra Miller-Rabin mở rộng các ý tưởng từ kiểm tra Fermat.

Đối với một số lẻ $n$, $n-1$ là chẵn và chúng ta có thể tách ra tất cả các lũy thừa của 2. Chúng ta có thể viết:

$$n - 1 = 2^s \cdot d, \text{ với } d \text{ lẻ}.$$

Điều này cho phép chúng ta phân tích phương trình của định lý nhỏ Fermat:

$$\begin{align}
a^{n-1} \equiv 1 \pmod{n} &\Longleftrightarrow a^{2^s d} - 1 \equiv 0 \pmod{n} \\
&\Longleftrightarrow (a^{2^{s-1} d} + 1)(a^{2^{s-1} d} - 1) \equiv 0 \pmod{n} \\
&\Longleftrightarrow (a^{2^{s-1} d} + 1)(a^{2^{s-2} d} + 1)(a^{2^{s-2} d} - 1) \equiv 0 \pmod{n} \\
&\quad\vdots \\
&\Longleftrightarrow (a^{2^{s-1} d} + 1)(a^{2^{s-2} d} + 1) \cdots (a^{d} + 1)(a^{d} - 1) \equiv 0 \pmod{n}
\end{align}$$

Nếu $n$ là nguyên tố, thì $n$ phải chia hết một trong các thừa số này. Và trong kiểm tra nguyên tố Miller-Rabin, chúng ta kiểm tra chính xác câu lệnh đó, đây là phiên bản chặt chẽ hơn của câu lệnh trong kiểm tra Fermat.

Đối với một cơ số $2 \leq a \leq n-2$, chúng ta kiểm tra xem có

$$a^d \equiv 1 \pmod{n}$$

hoặc

$$a^{2^r d} \equiv -1 \pmod{n}$$

với một số $0 \leq r \leq s - 1$.

### Code C++
```cpp
using u64 = uint64_t;
using u128 = __uint128_t;

u64 binpower(u64 base, u64 e, u64 mod) {
    u64 result = 1;
    base %= mod;
    while (e) {
        if (e & 1)
            result = (u128)result * base % mod;
        base = (u128)base * base % mod;
        e >>= 1;
    }
    return result;
}

bool check_composite(u64 n, u64 a, u64 d, int s) {
    u64 x = binpower(a, d, n);
    if (x == 1 || x == n - 1)
        return false;
    for (int r = 1; r < s; r++) {
        x = (u128)x * x % n;
        if (x == n - 1)
            return false;
    }
    return true;
}

bool MillerRabin(u64 n, int iter=5) {
    if (n < 4)
        return n == 2 || n == 3;

    int s = 0;
    u64 d = n - 1;
    while ((d & 1) == 0) {
        d >>= 1;
        s++;
    }

    for (int i = 0; i < iter; i++) {
        int a = 2 + rand() % (n - 3);
        if (check_composite(n, a, d, s))
            return false;
    }
    return true;
}
```

### Code Python
```python
import random

def mod_exp_miller(base, exp, mod):
    """
    Tính (base^exp) % mod với xử lý số lớn
    """
    result = 1
    base = base % mod
    while exp > 0:
        if exp & 1:
            result = (result * base) % mod
        base = (base * base) % mod
        exp >>= 1
    return result

def check_composite(n, a, d, s):
    """
    Kiểm tra xem n có phải là số hợp với nhân chứng a
    """
    x = mod_exp_miller(a, d, n)
    if x == 1 or x == n - 1:
        return False
    
    for _ in range(s - 1):
        x = (x * x) % n
        if x == n - 1:
            return False
    
    return True

def miller_rabin(n, k=5):
    """
    Kiểm tra nguyên tố Miller-Rabin
    n: số cần kiểm tra
    k: số lần lặp
    """
    if n < 4:
        return n == 2 or n == 3
    if n % 2 == 0:
        return False
    
    # Viết n-1 = 2^s * d với d lẻ
    s = 0
    d = n - 1
    while d % 2 == 0:
        d //= 2
        s += 1
    
    # Thực hiện k lần kiểm tra
    for _ in range(k):
        a = random.randint(2, n - 2)
        if check_composite(n, a, d, s):
            return False
    
    return True

# Phiên bản xác định với các cơ số cố định
def miller_rabin_deterministic(n):
    """
    Phiên bản xác định của Miller-Rabin cho số 64-bit
    """
    if n < 2:
        return False
    if n == 2 or n == 3:
        return True
    if n % 2 == 0:
        return False
    
    # Viết n-1 = 2^s * d với d lẻ
    s = 0
    d = n - 1
    while d % 2 == 0:
        d //= 2
        s += 1
    
    # Các cơ số cho kiểm tra xác định với số 64-bit
    bases = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]
    
    for a in bases:
        if n == a:
            return True
        if check_composite(n, a, d, s):
            return False
    
    return True

# Ví dụ sử dụng và so sánh
test_numbers = [2, 3, 17, 25, 29, 97, 561, 1009, 1013, 2047, 3215031751]

print("So sánh các thuật toán kiểm tra số nguyên tố:")
print("Số\t\tChia thử\tFermat\t\tMiller-Rabin\tMR Xác định")
print("-" * 70)

for num in test_numbers:
    trial = is_prime_trial_division(num)
    fermat = fermat_test(num, 10)  # Nhiều lần lặp hơn
    mr_prob = miller_rabin(num, 10)
    mr_det = miller_rabin_deterministic(num) if num < 2**63 else "N/A"
    
    print(f"{num}\t\t{trial}\t\t{fermat}\t\t{mr_prob}\t\t{mr_det}")

# Kiểm tra hiệu suất với số lớn
large_primes = [982451653, 982451657, 982451659]
print(f"\nKiểm tra số nguyên tố lớn:")
for prime in large_primes:
    result = miller_rabin_deterministic(prime)
    print(f"{prime}: {'Nguyên tố' if result else 'Không phải nguyên tố'}")
```

### Phiên bản xác định

Miller đã chỉ ra rằng có thể làm cho thuật toán trở nên xác định bằng cách chỉ kiểm tra tất cả các cơ số $\leq O((\ln n)^2)$. Bach sau đó đã đưa ra một giới hạn cụ thể, chỉ cần kiểm tra tất cả các cơ số $a \leq 2 \ln(n)^2$.

Đây vẫn là một số lượng cơ số khá lớn. Vì vậy, mọi người đã đầu tư khá nhiều sức mạnh tính toán để tìm ra giới hạn thấp hơn. Hóa ra, để kiểm tra số nguyên 32 bit, chỉ cần kiểm tra 4 cơ số nguyên tố đầu tiên: 2, 3, 5 và 7. Số hợp nhỏ nhất không qua được kiểm tra này là $3,215,031,751 = 151 \cdot 751 \cdot 28351$. Và để kiểm tra số nguyên 64 bit, đủ để kiểm tra 12 cơ số nguyên tố đầu tiên: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31 và 37.

### Code Python cho phiên bản xác định
```python
def miller_rabin_32bit(n):
    """
    Miller-Rabin xác định cho số 32-bit
    """
    if n < 2:
        return False
    if n in [2, 3, 5, 7]:
        return True
    if n % 2 == 0:
        return False
    
    s = 0
    d = n - 1
    while d % 2 == 0:
        d //= 2
        s += 1
    
    # Chỉ cần 4 cơ số cho số 32-bit
    for a in [2, 3, 5, 7]:
        if check_composite(n, a, d, s):
            return False
    
    return True

def miller_rabin_64bit(n):
    """
    Miller-Rabin xác định cho số 64-bit
    """
    if n < 2:
        return False
    if n in [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]:
        return True
    if n % 2 == 0:
        return False
    
    s = 0
    d = n - 1
    while d % 2 == 0:
        d //= 2
        s += 1
    
    # 12 cơ số cho số 64-bit
    bases = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]
    for a in bases:
        if check_composite(n, a, d, s):
            return False
    
    return True

# Test với các số đặc biệt
print("Kiểm tra Miller-Rabin xác định:")
special_numbers = [3215031751, 341, 561, 645, 1105, 1387, 1729, 1905]
for num in special_numbers:
    if num < 2**32:
        result32 = miller_rabin_32bit(num)
        result64 = miller_rabin_64bit(num)
        trial = is_prime_trial_division(num)
        print(f"{num}: MR-32={result32}, MR-64={result64}, Trial={trial}")
```

## So sánh các thuật toán

| Thuật toán | Độ phức tạp | Độ chính xác | Ưu điểm | Nhược điểm |
|------------|-------------|---------------|---------|------------|
| Chia thử | $O(\sqrt{n})$ | 100% | Đơn giản, chính xác | Chậm với số lớn |
| Fermat | $O(k \log n)$ | Xác suất cao | Nhanh | Số Carmichael |
| Miller-Rabin | $O(k \log n)$ | Rất cao | Nhanh, tin cậy | Xác suất |
| MR Xác định | $O(\log n)$ | 100% | Nhanh, chính xác | Chỉ với số nhỏ |

## Ứng dụng thực tế

### 1. Sinh số nguyên tố ngẫu nhiên
```python
def generate_random_prime(bits):
    """
    Sinh số nguyên tố ngẫu nhiên có số bit cho trước
    """
    while True:
        # Sinh số lẻ ngẫu nhiên
        n = random.getrandbits(bits)
        n |= (1 << bits - 1) | 1  # Đảm bảo bit cao nhất và thấp nhất là 1
        
        if miller_rabin(n, 20):  # Kiểm tra với độ tin cậy cao
            return n

# Sinh số nguyên tố 1024-bit (dùng trong RSA)
print("Sinh số nguyên tố ngẫu nhiên:")
prime_512 = generate_random_prime(512)
print(f"Số nguyên tố 512-bit: {prime_512}")
```

### 2. Kiểm tra số nguyên tố trong khoảng
```python
def primes_in_range(start, end):
    """
    Tìm tất cả số nguyên tố trong khoảng [start, end]
    """
    primes = []
    for n in range(max(2, start), end + 1):
        if miller_rabin_deterministic(n):
            primes.append(n)
    return primes

# Tìm số nguyên tố từ 100 đến 200
primes_100_200 = primes_in_range(100, 200)
print(f"Số nguyên tố từ 100 đến 200: {primes_100_200}")
print(f"Tổng cộng: {len(primes_100_200)} số")
```

### 3. Factorization với số nguyên tố
```python
def pollard_rho(n):
    """
    Thuật toán Pollard's Rho để phân tích thừa số
    """
    if n % 2 == 0:
        return 2
    
    x = random.randint(2, n - 1)
    y = x
    c = random.randint(1, n - 1)
    d = 1
    
    while d == 1:
        x = (x * x + c) % n
        y = (y * y + c) % n
        y = (y * y + c) % n
        d = math.gcd(abs(x - y), n)
    
    return d

def factorize_with_primality_test(n):
    """
    Phân tích thừa số sử dụng kiểm tra nguyên tố
    """
    if n <= 1:
        return []
    if miller_rabin_deterministic(n):
        return [n]
    
    factors = []
    
    # Kiểm tra các thừa số nhỏ
    for p in [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31]:
        while n % p == 0:
            factors.append(p)
            n //= p
    
    # Sử dụng Pollard's Rho cho phần còn lại
    while n > 1 and not miller_rabin_deterministic(n):
        d = pollard_rho(n)
        factors.extend(factorize_with_primality_test(d))
        n //= d
    
    if n > 1:
        factors.append(n)
    
    return sorted(factors)

# Ví dụ phân tích thừa số
test_composite = 1234567890
factors = factorize_with_primality_test(test_composite)
print(f"\nPhân tích thừa số của {test_composite}:")
print(f"Thừa số: {factors}")
print(f"Kiểm tra: {' × '.join(map(str, factors))} = {eval('*'.join(map(str, factors)))}")
```

## Bài tập thực hành

- [SPOJ - Prime or Not](https://www.spoj.com/problems/PON/)
- [Project Euler - Investigating a Prime Pattern](https://projecteuler.net/problem=146)

## Tài liệu tham khảo

- [CP-Algorithms: Primality Tests](https://cp-algorithms.com/algebra/primality_tests.html)
- Miller, G. L. (1976). "Riemann's Hypothesis and Tests for Primality"
- Rabin, M. O. (1980). "Probabilistic algorithm for testing primality"
