# Giai thừa modulo p (Factorial modulo p)

## Giới thiệu

Trong một số trường hợp, ta cần tính các công thức phức tạp modulo một số nguyên tố $p$, chứa giai thừa ở cả tử số và mẫu số, như trong công thức tính hệ số nhị thức. Chúng ta xét trường hợp khi $p$ tương đối nhỏ.

Bài toán này chỉ có ý nghĩa khi giai thừa xuất hiện ở cả tử và mẫu của phân số. Nếu không, $p!$ và các số hạng tiếp theo sẽ bằng 0. Nhưng trong phân số, các thừa số $p$ có thể triệt tiêu nhau, và biểu thức kết quả sẽ khác 0 modulo $p$.

## Định nghĩa bài toán

**Mục tiêu**: Tính $n! \bmod p$ mà không tính đến tất cả các thừa số $p$ xuất hiện trong giai thừa.

Hình dung bạn viết ra phân tích thừa số nguyên tố của $n!$, loại bỏ tất cả các thừa số $p$, và tính tích modulo $p$. Ta ký hiệu giai thừa biến đổi này là $n!_{\%p}$.

### Ví dụ
$$7!_{\%3} \equiv 1 \cdot 2 \cdot \underbrace{1}_{3} \cdot 4 \cdot 5 \cdot \underbrace{2}_{6} \cdot 7 \equiv 2 \pmod{3}$$

Trong đó:
- $3 \to 1$ (loại bỏ thừa số 3)
- $6 = 2 \cdot 3 \to 2$ (loại bỏ thừa số 3)

## Thuật toán

### Phân tích cấu trúc

Viết giai thừa biến đổi một cách tường minh:

$$
\begin{align*}
n!_{\%p} =\ & 1 \cdot 2 \cdot 3 \cdot \ldots \cdot (p-2) \cdot (p-1) \cdot \underbrace{1}_{p} \cdot (p+1) \cdot (p+2) \cdot \ldots \cdot (2p-1) \cdot \underbrace{2}_{2p} \\
& \cdot (2p+1) \cdot \ldots \cdot (p^2-1) \cdot \underbrace{1}_{p^2} \cdot (p^2 +1) \cdot \ldots \cdot n \pmod{p}
\end{align*}
$$

### Chia thành các khối

Ta có thể thấy giai thừa được chia thành nhiều khối có độ dài giống nhau, trừ khối cuối:

$$
\begin{align*}
n!_{\%p} &= \underbrace{1 \cdot 2 \cdot 3 \cdot \ldots \cdot (p-2) \cdot (p-1) \cdot 1}_{1\text{st}} \cdot \underbrace{1 \cdot 2 \cdot 3 \cdot \ldots \cdot (p-2) \cdot (p-1) \cdot 2}_{2\text{nd}} \cdot \ldots \\
&\quad \cdot \underbrace{1 \cdot 2 \cdot 3 \cdot \ldots \cdot (p-2) \cdot (p-1) \cdot 1}_{p\text{th}} \cdot \ldots \cdot \underbrace{1 \cdot 2 \cdot \ldots \cdot (n \bmod p)}_{\text{tail}} \pmod{p}
\end{align*}
$$

### Áp dụng định lý Wilson

Phần chính của các khối dễ tính: đó chính là $(p-1)! \bmod p$.

**Định lý Wilson**: Với số nguyên tố $p$, ta có $(p-1)! \equiv -1 \pmod{p}$.

### Tính số lượng khối

Ta có chính xác $\lfloor \frac{n}{p} \rfloor$ khối như vậy, do đó cần nâng $-1$ lên lũy thừa $\lfloor \frac{n}{p} \rfloor$.

- Nếu $\lfloor \frac{n}{p} \rfloor$ lẻ: kết quả nhân với $-1$
- Nếu $\lfloor \frac{n}{p} \rfloor$ chẵn: kết quả không đổi

### Phần đuôi và đệ quy

Giá trị của khối cuối có thể tính riêng trong $O(p)$.

Phần tử cuối của mỗi khối tạo thành một giai thừa biến đổi khác với kích thước nhỏ hơn:
$$\lfloor n / p \rfloor !_{\%p}$$

## Độ phức tạp

- **Không tiền xử lý**: $O(p \log_p n)$
- **Có tiền xử lý**: $O(p + \log_p n)$ cho tính toán đầu tiên, $O(\log_p n)$ cho các lần sau

## Cài đặt

### Cài đặt cơ bản (C++)

```cpp
#include <bits/stdc++.h>
using namespace std;

// Tính giai thừa biến đổi n! mod p (loại bỏ các thừa số p)
int factmod(int n, int p) {
    // Tiền xử lý giai thừa 0!, 1!, ..., (p-1)!
    vector<int> f(p);
    f[0] = 1;
    for (int i = 1; i < p; i++) {
        f[i] = f[i-1] * i % p;
    }
    
    int res = 1;
    while (n > 1) {
        // Áp dụng định lý Wilson
        if ((n/p) % 2) {
            res = p - res;  // Nhân với -1
        }
        
        // Nhân với phần đuôi
        res = res * f[n % p] % p;
        n /= p;
    }
    return res;
}

// Hàm test
void test_factmod() {
    cout << "Test factorial modulo:" << endl;
    
    // Test 7! mod 3
    int result = factmod(7, 3);
    cout << "7! mod 3 (loại bỏ thừa số 3) = " << result << endl;
    // Kết quả: 2
    
    // Test 10! mod 5
    result = factmod(10, 5);
    cout << "10! mod 5 (loại bỏ thừa số 5) = " << result << endl;
    
    // Test 15! mod 7
    result = factmod(15, 7);
    cout << "15! mod 7 (loại bỏ thừa số 7) = " << result << endl;
}
```

### Cài đặt tối ưu bộ nhớ

```cpp
// Phiên bản tiết kiệm bộ nhớ
int factmod_memory_efficient(int n, int p) {
    int res = 1;
    
    while (n > 1) {
        // Tính (n%p)! trực tiếp
        for (int i = 1; i <= n % p; i++) {
            res = res * i % p;
        }
        
        // Áp dụng định lý Wilson
        if ((n/p) % 2) {
            res = p - res;
        }
        
        n /= p;
    }
    return res;
}
```

### Cài đặt với Python

```python
def factorial_mod(n, p):
    """
    Tính giai thừa biến đổi n! mod p (loại bỏ các thừa số p)
    
    Args:
        n: số nguyên dương
        p: số nguyên tố
    
    Returns:
        n!_{% p} mod p
    """
    # Tiền xử lý giai thừa
    f = [1] * p
    for i in range(1, p):
        f[i] = (f[i-1] * i) % p
    
    result = 1
    while n > 1:
        # Áp dụng định lý Wilson
        if (n // p) % 2 == 1:
            result = p - result
        
        # Nhân với phần đuôi
        result = (result * f[n % p]) % p
        n //= p
    
    return result

def test_factorial_mod():
    """Test các trường hợp cơ bản"""
    test_cases = [
        (7, 3, 2),
        (10, 5, 4),
        (15, 7, 1),
        (20, 11, 1)
    ]
    
    for n, p, expected in test_cases:
        result = factorial_mod(n, p)
        print(f"{n}! mod {p} (loại bỏ thừa số {p}) = {result}")
        assert result == expected, f"Sai! Kỳ vọng {expected}, nhận {result}"
    
    print("Tất cả test cases đã pass!")

if __name__ == "__main__":
    test_factorial_mod()
```

## Bội số của p (Multiplicity of p)

Khi tính hệ số nhị thức modulo $p$, ta cần thêm bội số của $p$ trong $n!$, tức số lần $p$ xuất hiện trong phân tích thừa số nguyên tố của $n!$.

### Công thức Legendre

**Công thức Legendre** cho ta cách tính bội số $\nu_p(n!)$ trong thời gian $O(\log_p n)$:

$$\nu_p(n!) = \sum_{i=1}^{\infty} \left\lfloor \frac{n}{p^i} \right\rfloor$$

### Cài đặt

```cpp
// Tính bội số của p trong n!
int multiplicity_factorial(int n, int p) {
    int count = 0;
    do {
        n /= p;
        count += n;
    } while (n);
    return count;
}

// Phiên bản chi tiết hơn
long long multiplicity_factorial_detailed(long long n, long long p) {
    long long count = 0;
    long long power = p;
    
    while (power <= n) {
        count += n / power;
        
        // Tránh overflow
        if (power > LLONG_MAX / p) break;
        power *= p;
    }
    
    return count;
}
```

### Cài đặt Python

```python
def multiplicity_factorial(n, p):
    """
    Tính bội số của p trong n! sử dụng công thức Legendre
    
    Args:
        n: số nguyên dương
        p: số nguyên tố
    
    Returns:
        Số lần p xuất hiện trong phân tích thừa số nguyên tố của n!
    """
    count = 0
    while n > 0:
        n //= p
        count += n
    return count

def test_multiplicity():
    """Test tính bội số"""
    test_cases = [
        (10, 2, 8),   # 10! = 2^8 * ...
        (10, 3, 4),   # 10! = 3^4 * ...
        (10, 5, 2),   # 10! = 5^2 * ...
        (25, 5, 6),   # 25! = 5^6 * ...
    ]
    
    for n, p, expected in test_cases:
        result = multiplicity_factorial(n, p)
        print(f"Bội số của {p} trong {n}! = {result}")
        assert result == expected, f"Sai! Kỳ vọng {expected}, nhận {result}"
    
    print("Tất cả test cases về bội số đã pass!")

if __name__ == "__main__":
    test_multiplicity()
```

## Ứng dụng

### 1. Tính hệ số nhị thức modulo p

```cpp
// Tính C(n, k) mod p
int binomial_mod(int n, int k, int p) {
    if (k > n) return 0;
    
    // Tính giai thừa biến đổi
    int num = factmod(n, p);
    int den1 = factmod(k, p);
    int den2 = factmod(n - k, p);
    
    // Tính bội số
    int mult_n = multiplicity_factorial(n, p);
    int mult_k = multiplicity_factorial(k, p);
    int mult_nk = multiplicity_factorial(n - k, p);
    
    // Kiểm tra chia hết cho p
    if (mult_n > mult_k + mult_nk) {
        return 0;  // Chia hết cho p
    }
    
    // Tính nghịch đảo modular
    int inv_den1 = mod_inverse(den1, p);
    int inv_den2 = mod_inverse(den2, p);
    
    return (1LL * num * inv_den1 % p) * inv_den2 % p;
}

// Hàm nghịch đảo modular
int mod_inverse(int a, int p) {
    // Sử dụng định lý Fermat nhỏ: a^(p-1) ≡ 1 (mod p)
    // => a^(p-2) ≡ a^(-1) (mod p)
    return power(a, p - 2, p);
}

int power(int a, int b, int mod) {
    int result = 1;
    a %= mod;
    while (b > 0) {
        if (b & 1) result = (1LL * result * a) % mod;
        a = (1LL * a * a) % mod;
        b >>= 1;
    }
    return result;
}
```

### 2. Tính dãy số Catalan modulo p

```python
def catalan_mod(n, p):
    """
    Tính số Catalan thứ n modulo p
    C_n = (1/(n+1)) * C(2n, n) = C(2n, n) - C(2n, n+1)
    """
    # Sử dụng công thức thay thế để tránh chia
    # C_n = C(2n, n) / (n+1)
    
    # Tính C(2n, n)
    c_2n_n = binomial_mod(2*n, n, p)
    
    # Tính C(2n, n+1)  
    c_2n_n1 = binomial_mod(2*n, n+1, p)
    
    # C_n = C(2n, n) - C(2n, n+1)
    return (c_2n_n - c_2n_n1 + p) % p

def test_catalan():
    """Test số Catalan"""
    # Các số Catalan đầu tiên: 1, 1, 2, 5, 14, 42, 132, ...
    catalan_values = [1, 1, 2, 5, 14, 42, 132, 429, 1430, 4862]
    
    p = 1000000007  # Số nguyên tố lớn
    
    for i in range(len(catalan_values)):
        result = catalan_mod(i, p)
        expected = catalan_values[i] % p
        print(f"C_{i} mod {p} = {result}")
        assert result == expected, f"Sai ở C_{i}!"
    
    print("Test số Catalan thành công!")
```

### 3. Tính số cách sắp xếp có điều kiện

```cpp
// Số cách sắp xếp n phần tử sao cho không có phần tử nào ở đúng vị trí (Derangement)
int derangement_mod(int n, int p) {
    if (n == 0) return 1;
    if (n == 1) return 0;
    
    // D(n) = (n-1) * [D(n-1) + D(n-2)]
    // Hoặc sử dụng công thức: D(n) = n! * Σ((-1)^k / k!) với k từ 0 đến n
    
    int factorial_n = factmod(n, p);
    int result = 0;
    int sign = 1;
    
    for (int k = 0; k <= n; k++) {
        int factorial_k = factmod(k, p);
        int inv_k = mod_inverse(factorial_k, p);
        
        result = (result + sign * inv_k + p) % p;
        sign = -sign;
    }
    
    return (1LL * factorial_n * result) % p;
}
```

## Ví dụ minh họa

### Ví dụ 1: Tính 7! mod 3

```
Phân tích: 7! = 1·2·3·4·5·6·7 = 1·2·3·4·5·(2·3)·7
Loại bỏ thừa số 3: = 1·2·1·4·5·2·7 = 560 ≡ 2 (mod 3)

Sử dụng thuật toán:
- Khối 1: 1·2·1 = 2 (định lý Wilson: 2! ≡ 2 ≡ -1 (mod 3))
- Khối 2: 1·2·2 = 4 ≡ 1 (mod 3)  
- Phần đuôi: 1 (7 mod 3 = 1, nên 1! = 1)
- Kết quả: 2·1·1 = 2
```

### Ví dụ 2: Tính C(10, 3) mod 7

```python
def example_binomial():
    n, k, p = 10, 3, 7
    
    print(f"Tính C({n}, {k}) mod {p}")
    
    # Tính giai thừa biến đổi
    fact_n = factorial_mod(n, p)
    fact_k = factorial_mod(k, p)
    fact_nk = factorial_mod(n-k, p)
    
    print(f"{n}! mod {p} (loại bỏ thừa số {p}) = {fact_n}")
    print(f"{k}! mod {p} (loại bỏ thừa số {p}) = {fact_k}")
    print(f"{n-k}! mod {p} (loại bỏ thừa số {p}) = {fact_nk}")
    
    # Tính bội số
    mult_n = multiplicity_factorial(n, p)
    mult_k = multiplicity_factorial(k, p)
    mult_nk = multiplicity_factorial(n-k, p)
    
    print(f"Bội số của {p} trong {n}! = {mult_n}")
    print(f"Bội số của {p} trong {k}! = {mult_k}")
    print(f"Bội số của {p} trong {n-k}! = {mult_nk}")
    
    # Kiểm tra chia hết
    if mult_n > mult_k + mult_nk:
        print(f"C({n}, {k}) chia hết cho {p}")
        return 0
    else:
        print(f"C({n}, {k}) không chia hết cho {p}")
        
    # Tính kết quả
    result = binomial_mod(n, k, p)
    print(f"C({n}, {k}) mod {p} = {result}")
    
    # Kiểm tra bằng tính toán trực tiếp
    import math
    direct = math.comb(n, k) % p
    print(f"Kiểm tra trực tiếp: {direct}")
    
    return result

example_binomial()
```

## Bài tập thực hành

### Cơ bản
1. **Giai thừa nhỏ**: Tính $5!, 6!, 7!$ modulo 3 (loại bỏ thừa số 3)
2. **Hệ số nhị thức**: Tính $\binom{8}{3}, \binom{10}{4}$ modulo 5
3. **Bội số**: Tìm bội số của 2 trong $16!, 20!, 25!$

### Trung bình  
4. **Số Catalan**: Tính 5 số Catalan đầu tiên modulo 11
5. **Derangement**: Tính số hoán vị sai lệch của 6 phần tử modulo 7
6. **Tối ưu**: Cài đặt hàm tính nhiều hệ số nhị thức với cùng modulo

### Nâng cao
7. **Số nguyên tố lớn**: Tính $\binom{10^6}{10^3}$ modulo $10^9+7$
8. **Dãy số phức tạp**: Tính $\sum_{k=0}^{n} \binom{n}{k}^2$ modulo $p$
9. **Ứng dụng**: Giải bài toán đếm số cách tô màu lưới $n \times m$ với điều kiện

## Tài liệu tham khảo

1. **CP-Algorithms**: [Factorial modulo p](https://cp-algorithms.com/algebra/factorial-modulo.html)
2. **Concrete Mathematics** - Graham, Knuth, Patashnik
3. **Định lý Wilson**: [Wilson's Theorem](https://en.wikipedia.org/wiki/Wilson%27s_theorem)
4. **Công thức Legendre**: [Legendre's Formula](https://en.wikipedia.org/wiki/Legendre%27s_formula)

## Lưu ý quan trọng

1. **Điều kiện**: $p$ phải là số nguyên tố
2. **Ứng dụng**: Chủ yếu trong tính hệ số nhị thức và tổ hợp
3. **Tối ưu**: Tiền xử lý khi cần tính nhiều lần với cùng $p$
4. **Overflow**: Cẩn thận với phép nhân khi $p$ lớn

## Tổng kết

Thuật toán tính giai thừa modulo $p$ là công cụ quan trọng trong:
- **Tổ hợp học**: Tính hệ số nhị thức, số Catalan
- **Lý thuyết số**: Nghiên cứu tính chất số học
- **Lập trình thi đấu**: Giải bài toán đếm phức tạp
- **Mật mã học**: Ứng dụng trong các sơ đồ mật mã

Độ phức tạp $O(\log_p n)$ sau tiền xử lý làm cho thuật toán rất hiệu quả cho các ứng dụng thực tế.