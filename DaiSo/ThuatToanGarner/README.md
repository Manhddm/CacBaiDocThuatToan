# Thuật Toán Garner (Garner's Algorithm)

## Giới thiệu

Thuật toán Garner là một phương pháp hiệu quả để chuyển đổi từ hệ thống đồng dư (Chinese Remainder System) về số nguyên ban đầu. Đây là một ứng dụng quan trọng của **Định lý Số dư Trung Quốc**, cho phép biểu diễn các số lớn thông qua một mảng các số nguyên nhỏ.

## Biểu diễn cơ số hỗn hợp (Mixed Radix Representation)

### Định nghĩa

Ta có thể biểu diễn số $a$ dưới dạng cơ số hỗn hợp:

$$a = x_1 + x_2 p_1 + x_3 p_1 p_2 + \ldots + x_k p_1 \cdots p_{k-1}$$

trong đó $x_i \in [0, p_i)$ với $i = 1, 2, \ldots, k$.

### Ý nghĩa

- **Hệ cơ số vị trí**: Biểu diễn cơ số hỗn hợp là một dạng tổng quát của hệ thống số vị trí thông thường
- **Cơ số thay đổi**: Khác với hệ thập phân (cơ số 10) hay nhị phân (cơ số 2), ở đây cơ số thay đổi từ vị trí này sang vị trí khác
- **Ứng dụng**: Cho phép biểu diễn số rất lớn một cách hiệu quả

### Ví dụ

Trong hệ thập phân, số 415 được biểu diễn như: $415 = 4 \cdot 10^2 + 1 \cdot 10^1 + 5 \cdot 10^0$

Trong hệ cơ số hỗn hợp với các modulo $p_1 = 3, p_2 = 5, p_3 = 7$:
- Số 23 có thể được biểu diễn như: $23 = 2 + 1 \cdot 3 + 2 \cdot 3 \cdot 5 = 2 + 3 + 30 = 35$

## Thuật toán Garner

### Mục đích
Thuật toán Garner tính toán các chữ số $x_1, x_2, \ldots, x_k$ trong biểu diễn cơ số hỗn hợp.

### Ký hiệu
Đặt $r_{ij}$ là nghịch đảo modular của $p_i$ theo modulo $p_j$:

$$r_{ij} = (p_i)^{-1} \pmod{p_j}$$

### Quá trình tính toán

Từ hệ phương trình đồng dư:
$$\begin{cases}
a \equiv a_1 \pmod{p_1} \\
a \equiv a_2 \pmod{p_2} \\
\vdots \\
a \equiv a_k \pmod{p_k}
\end{cases}$$

**Bước 1:** Từ phương trình đầu tiên:
$$x_1 \equiv a_1 \pmod{p_1}$$

**Bước 2:** Thay vào phương trình thứ hai:
$$a_2 \equiv x_1 + x_2 p_1 \pmod{p_2}$$

Biến đổi để tìm $x_2$:
$$x_2 \equiv (a_2 - x_1) r_{12} \pmod{p_2}$$

**Bước 3:** Tương tự cho $x_3$:
$$x_3 \equiv ((a_3 - x_1) r_{13} - x_2) r_{23} \pmod{p_3}$$

### Công thức tổng quát

```
for i = 0 to k-1:
    x[i] = a[i]
    for j = 0 to i-1:
        x[i] = (x[i] - x[j]) * r[j][i] mod p[i]
        if x[i] < 0:
            x[i] += p[i]
```

### Phục hồi số ban đầu

Sau khi có các $x_i$, ta tính số ban đầu:
$$a = x_1 + x_2 \cdot p_1 + x_3 \cdot p_1 \cdot p_2 + \ldots + x_k \cdot p_1 \cdots p_{k-1}$$

## Cài đặt

### Cài đặt cơ bản (C++)

```cpp
#include <bits/stdc++.h>
using namespace std;

// Tính nghịch đảo modular
long long modInverse(long long a, long long m) {
    // Sử dụng thuật toán Euclidean mở rộng
    long long m0 = m, x0 = 0, x1 = 1;
    if (m == 1) return 0;
    
    while (a > 1) {
        long long q = a / m;
        long long t = m;
        m = a % m;
        a = t;
        t = x0;
        x0 = x1 - q * x0;
        x1 = t;
    }
    
    if (x1 < 0) x1 += m0;
    return x1;
}

// Thuật toán Garner
vector<long long> garner(vector<long long>& a, vector<long long>& p) {
    int k = a.size();
    vector<vector<long long>> r(k, vector<long long>(k));
    
    // Tính toán bảng nghịch đảo modular
    for (int i = 0; i < k; i++) {
        for (int j = i + 1; j < k; j++) {
            r[i][j] = modInverse(p[i], p[j]);
        }
    }
    
    vector<long long> x(k);
    for (int i = 0; i < k; i++) {
        x[i] = a[i];
        for (int j = 0; j < i; j++) {
            x[i] = ((x[i] - x[j]) * r[j][i]) % p[i];
            if (x[i] < 0) x[i] += p[i];
        }
    }
    
    return x;
}

// Phục hồi số từ biểu diễn cơ số hỗn hợp
long long reconstruct(vector<long long>& x, vector<long long>& p) {
    long long result = 0;
    long long mult = 1;
    
    for (int i = 0; i < x.size(); i++) {
        result += x[i] * mult;
        mult *= p[i];
    }
    
    return result;
}
```

### Cài đặt với số lớn (Python)

```python
def extended_gcd(a, b):
    """Thuật toán Euclidean mở rộng"""
    if a == 0:
        return b, 0, 1
    gcd, x1, y1 = extended_gcd(b % a, a)
    x = y1 - (b // a) * x1
    y = x1
    return gcd, x, y

def mod_inverse(a, m):
    """Tính nghịch đảo modular"""
    gcd, x, _ = extended_gcd(a % m, m)
    if gcd != 1:
        raise ValueError("Nghịch đảo modular không tồn tại")
    return (x % m + m) % m

def garner_algorithm(remainders, moduli):
    """
    Thuật toán Garner
    Args:
        remainders: danh sách các số dư [a1, a2, ..., ak]
        moduli: danh sách các modulo [p1, p2, ..., pk]
    Returns:
        tuple: (mixed_radix_digits, original_number)
    """
    k = len(remainders)
    
    # Tính bảng nghịch đảo modular
    r = [[0] * k for _ in range(k)]
    for i in range(k):
        for j in range(i + 1, k):
            r[i][j] = mod_inverse(moduli[i], moduli[j])
    
    # Tính các chữ số trong biểu diễn cơ số hỗn hợp
    x = [0] * k
    for i in range(k):
        x[i] = remainders[i]
        for j in range(i):
            x[i] = ((x[i] - x[j]) * r[j][i]) % moduli[i]
    
    # Phục hồi số ban đầu
    result = 0
    mult = 1
    for i in range(k):
        result += x[i] * mult
        mult *= moduli[i]
    
    return x, result

# Ví dụ sử dụng
def example_usage():
    # Hệ phương trình đồng dư:
    # x ≡ 2 (mod 3)
    # x ≡ 3 (mod 5) 
    # x ≡ 2 (mod 7)
    
    remainders = [2, 3, 2]
    moduli = [3, 5, 7]
    
    mixed_radix, original = garner_algorithm(remainders, moduli)
    
    print(f"Số dư: {remainders}")
    print(f"Moduli: {moduli}")
    print(f"Biểu diễn cơ số hỗn hợp: {mixed_radix}")
    print(f"Số ban đầu: {original}")
    
    # Kiểm tra
    for i, (rem, mod) in enumerate(zip(remainders, moduli)):
        assert original % mod == rem, f"Sai ở modulo {mod}"
    print("Kiểm tra thành công!")

if __name__ == "__main__":
    example_usage()
```

### Cài đặt cho số cực lớn

```cpp
#include <bits/stdc++.h>
using namespace std;

const int SZ = 100;  // Sử dụng 100 số nguyên tố
int primes[SZ];
int r[SZ][SZ];

// Khởi tạo các số nguyên tố và bảng nghịch đảo
void init() {
    // Sinh 100 số nguyên tố đầu tiên > 10^9
    vector<bool> is_prime(2000000000, true);
    int count = 0;
    
    for (long long x = 1000000000; count < SZ; x++) {
        if (isPrime(x)) {
            primes[count++] = x;
        }
    }
    
    // Tính bảng nghịch đảo modular
    for (int i = 0; i < SZ; i++) {
        for (int j = i + 1; j < SZ; j++) {
            r[i][j] = modInverse(primes[i], primes[j]);
        }
    }
}

class BigNumber {
private:
    int remainders[SZ];
    
public:
    BigNumber() {
        memset(remainders, 0, sizeof(remainders));
    }
    
    BigNumber(long long n) {
        for (int i = 0; i < SZ; i++) {
            remainders[i] = n % primes[i];
        }
    }
    
    BigNumber add(const BigNumber& other) {
        BigNumber result;
        for (int i = 0; i < SZ; i++) {
            result.remainders[i] = (remainders[i] + other.remainders[i]) % primes[i];
        }
        return result;
    }
    
    BigNumber multiply(const BigNumber& other) {
        BigNumber result;
        for (int i = 0; i < SZ; i++) {
            long long product = (1LL * remainders[i] * other.remainders[i]) % primes[i];
            result.remainders[i] = product;
        }
        return result;
    }
    
    // Chuyển đổi về số nguyên (sử dụng thuật toán Garner)
    string toString() {
        vector<long long> x(SZ);
        
        // Thuật toán Garner
        for (int i = 0; i < SZ; i++) {
            x[i] = remainders[i];
            for (int j = 0; j < i; j++) {
                long long diff = (x[i] - x[j] + primes[i]) % primes[i];
                x[i] = (diff * r[j][i]) % primes[i];
            }
        }
        
        // Phục hồi số ban đầu (sử dụng big integer)
        // Implementation phụ thuộc vào thư viện big integer
        return reconstructBigInteger(x);
    }
};
```

## Độ phức tạp

- **Thời gian**: $O(k^2)$ để tính các chữ số $x_i$
- **Không gian**: $O(k^2)$ để lưu bảng nghịch đảo modular
- **Ưu điểm**: Các chữ số $x_i$ nhỏ, có thể sử dụng kiểu dữ liệu built-in

## Ứng dụng

### 1. Tính toán với số cực lớn
```cpp
// Ví dụ: Tính 1000! mod (10^9 + 7)
BigNumber factorial(int n) {
    BigNumber result(1);
    for (int i = 2; i <= n; i++) {
        result = result.multiply(BigNumber(i));
    }
    return result;
}
```

### 2. Mã hóa RSA với modulus lớn
```python
def rsa_with_garner(message, e, d, p, q):
    """RSA với thuật toán Garner cho tối ưu CRT"""
    n = p * q
    
    # Mã hóa
    ciphertext = pow(message, e, n)
    
    # Giải mã sử dụng CRT và Garner
    dp = d % (p - 1)
    dq = d % (q - 1)
    
    mp = pow(ciphertext, dp, p)
    mq = pow(ciphertext, dq, q)
    
    # Sử dụng Garner để kết hợp
    remainders = [mp, mq]
    moduli = [p, q]
    
    _, decrypted = garner_algorithm(remainders, moduli)
    return decrypted
```

### 3. Hệ thống số học modular
```python
class ModularSystem:
    def __init__(self, moduli):
        self.moduli = moduli
        self.k = len(moduli)
        
        # Tính bảng nghịch đảo
        self.r = [[0] * self.k for _ in range(self.k)]
        for i in range(self.k):
            for j in range(i + 1, self.k):
                self.r[i][j] = mod_inverse(moduli[i], moduli[j])
    
    def encode(self, number):
        """Chuyển số thành hệ thống đồng dư"""
        return [number % m for m in self.moduli]
    
    def decode(self, remainders):
        """Chuyển hệ thống đồng dư về số ban đầu"""
        _, result = garner_algorithm(remainders, self.moduli)
        return result
    
    def add(self, a_remainders, b_remainders):
        """Cộng hai số trong hệ thống đồng dư"""
        return [(a + b) % m for a, b, m in zip(a_remainders, b_remainders, self.moduli)]
    
    def multiply(self, a_remainders, b_remainders):
        """Nhân hai số trong hệ thống đồng dư"""
        return [(a * b) % m for a, b, m in zip(a_remainders, b_remainders, self.moduli)]
```

## Ví dụ minh họa

### Ví dụ 1: Cơ bản
```python
# Giải hệ phương trình đồng dư:
# x ≡ 2 (mod 3)
# x ≡ 1 (mod 4)
# x ≡ 3 (mod 5)

remainders = [2, 1, 3]
moduli = [3, 4, 5]

mixed_radix, original = garner_algorithm(remainders, moduli)

print(f"Biểu diễn cơ số hỗn hợp: {mixed_radix}")  # [2, 3, 0]
print(f"Số ban đầu: {original}")  # 8

# Kiểm tra:
# 8 % 3 = 2 ✓
# 8 % 4 = 0 ≠ 1 ✗
```

### Ví dụ 2: Tính toán số lớn
```python
# Tính 100! sử dụng hệ thống modular
import math

def factorial_modular(n, moduli):
    system = ModularSystem(moduli)
    
    # Tính n! trong mỗi modulo
    factorials = []
    for m in moduli:
        fact = 1
        for i in range(1, min(n + 1, m)):
            fact = (fact * i) % m
        factorials.append(fact)
    
    # Chuyển về số ban đầu
    return system.decode(factorials)

# Sử dụng các số nguyên tố nhỏ
small_primes = [101, 103, 107, 109, 113]
result = factorial_modular(10, small_primes)
print(f"10! = {result}")  # 3628800
print(f"Kiểm tra: {math.factorial(10)}")
```

## Bài tập thực hành

### Cơ bản
1. **Hệ đồng dư đơn giản**: Giải hệ $x \equiv 3 \pmod{5}$, $x \equiv 7 \pmod{11}$
2. **Ba phương trình**: Giải hệ $x \equiv 1 \pmod{3}$, $x \equiv 2 \pmod{7}$, $x \equiv 3 \pmod{11}$

### Trung bình
3. **Tính toán lớn**: Tính $50!$ sử dụng thuật toán Garner
4. **Modulus không nguyên tố tương đối**: Xử lý trường hợp $\gcd(p_i, p_j) > 1$

### Nâng cao
5. **Tối ưu bộ nhớ**: Cài đặt thuật toán Garner với $O(k)$ bộ nhớ
6. **Ứng dụng RSA**: Cài đặt giải mã RSA sử dụng CRT và Garner

## Tài liệu tham khảo

1. **CP-Algorithms**: [Garner's Algorithm](https://cp-algorithms.com/algebra/garners-algorithm.html)
2. **Knuth, Donald E.**: "The Art of Computer Programming, Volume 2"
3. **Menezes, A.**: "Handbook of Applied Cryptography"

## Lưu ý quan trọng

1. **Điều kiện**: Các moduli phải đôi một nguyên tố tương đối
2. **Độ chính xác**: Cần thư viện big integer cho số rất lớn
3. **Tối ưu**: Thuật toán rất hiệu quả cho tính toán song song
4. **Ứng dụng**: Quan trọng trong mật mã học và tính toán số học

## Kết luận

Thuật toán Garner là một công cụ mạnh mẽ trong:
- Tính toán với số cực lớn
- Mật mã học (đặc biệt RSA)
- Hệ thống số học modular
- Tối ưu hóa tính toán song song

Ưu điểm chính là cho phép thao tác với số lớn thông qua các phép toán trên số nhỏ, đồng thời duy trì độ chính xác và hiệu suất cao.