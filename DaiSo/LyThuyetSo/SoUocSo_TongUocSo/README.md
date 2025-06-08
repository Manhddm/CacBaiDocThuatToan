# Số ước số / Tổng ước số

Trong bài viết này, chúng ta thảo luận về cách tính số ước số $d(n)$ và tổng các ước số $\sigma(n)$ của một số cho trước $n$.

## Số ước số

Hiển nhiên là phân tích thừa số nguyên tố của một ước số $d$ phải là một tập con của phân tích thừa số nguyên tố của $n$. Ví dụ, $6 = 2 \cdot 3$ là một ước số của $60 = 2^2 \cdot 3 \cdot 5$. Vì vậy, chúng ta chỉ cần tìm tất cả các tập con khác nhau của phân tích thừa số nguyên tố của $n$.

Thông thường, số lượng tập con là $2^x$ đối với một tập hợp có $x$ phần tử. Tuy nhiên, điều này không còn đúng nếu có các phần tử lặp lại trong tập hợp. Trong trường hợp của chúng ta, một số thừa số nguyên tố có thể xuất hiện nhiều lần trong phân tích thừa số nguyên tố của $n$.

Nếu một thừa số nguyên tố $p$ xuất hiện $e$ lần trong phân tích thừa số nguyên tố của $n$, thì chúng ta có thể sử dụng thừa số $p$ tối đa $e$ lần trong tập con. Điều này có nghĩa là chúng ta có $e+1$ lựa chọn.

Do đó, nếu phân tích thừa số nguyên tố của $n$ là $p_1^{e_1} \cdot p_2^{e_2} \cdots p_k^{e_k}$, trong đó $p_i$ là các số nguyên tố phân biệt, thì số ước số là:

$$d(n) = (e_1 + 1) \cdot (e_2 + 1) \cdots (e_k + 1)$$

Một cách suy nghĩ về điều này như sau:

* **Nếu chỉ có một thừa số nguyên tố phân biệt** $n = p_1^{e_1}$, thì rõ ràng có $e_1 + 1$ ước số ($1, p_1, p_1^2, \dots, p_1^{e_1}$).

* **Nếu có hai thừa số nguyên tố phân biệt** $n = p_1^{e_1} \cdot p_2^{e_2}$, thì bạn có thể sắp xếp tất cả các ước số dưới dạng một bảng.

|            | 1         | $p_2$         | $p_2^2$         | $\dots$      | $p_2^{e_2}$         |
|------------|-----------|---------------|-----------------|--------------|---------------------|
| 1          | 1         | $p_2$         | $p_2^2$         | $\dots$      | $p_2^{e_2}$         |
| $p_1$      | $p_1$     | $p_1p_2$      | $p_1p_2^2$      | $\dots$      | $p_1p_2^{e_2}$      |
| $p_1^2$    | $p_1^2$   | $p_1^2p_2$    | $p_1^2p_2^2$    | $\dots$      | $p_1^2p_2^{e_2}$    |
| $\vdots$   | $\vdots$  | $\vdots$      | $\vdots$        | $\ddots$     | $\vdots$            |
| $p_1^{e_1}$| $p_1^{e_1}$| $p_1^{e_1}p_2$| $p_1^{e_1}p_2^2$| $\dots$      | $p_1^{e_1}p_2^{e_2}$|

Vì vậy, số ước số một cách hiển nhiên là $(e_1 + 1) \cdot (e_2 + 1)$.

* **Lập luận tương tự** có thể được đưa ra nếu có nhiều hơn hai thừa số nguyên tố phân biệt.

### Cài đặt

#### Code C++
```cpp
long long numberOfDivisors(long long num) {
    long long total = 1;
    for (int i = 2; (long long)i * i <= num; i++) {
        if (num % i == 0) {
            int e = 0;
            do {
                e++;
                num /= i;
            } while (num % i == 0);
            total *= e + 1;
        }
    }
    if (num > 1) {
        total *= 2;
    }
    return total;
}
```

#### Code Python
```python
def number_of_divisors(n):
    """
    Tính số ước số của n
    Độ phức tạp: O(√n)
    """
    if n <= 0:
        return 0
    if n == 1:
        return 1
    
    total = 1
    i = 2
    
    while i * i <= n:
        if n % i == 0:
            e = 0
            while n % i == 0:
                e += 1
                n //= i
            total *= (e + 1)
        i += 1
    
    # Nếu n > 1 thì n là thừa số nguyên tố
    if n > 1:
        total *= 2
    
    return total

# Phiên bản tối ưu
def number_of_divisors_optimized(n):
    """
    Phiên bản tối ưu cho số ước số
    """
    if n <= 0:
        return 0
    if n == 1:
        return 1
    
    total = 1
    
    # Xử lý thừa số 2
    if n % 2 == 0:
        e = 0
        while n % 2 == 0:
            e += 1
            n //= 2
        total *= (e + 1)
    
    # Xử lý các thừa số lẻ
    i = 3
    while i * i <= n:
        if n % i == 0:
            e = 0
            while n % i == 0:
                e += 1
                n //= i
            total *= (e + 1)
        i += 2
    
    # Nếu n > 1 thì n là thừa số nguyên tố lớn
    if n > 1:
        total *= 2
    
    return total

# Ví dụ sử dụng
print("Số ước số của các số từ 1 đến 20:")
for i in range(1, 21):
    div_count = number_of_divisors(i)
    print(f"d({i}) = {div_count}")

# Kiểm tra với số lớn
large_numbers = [100, 1000, 12345, 987654321]
print(f"\nSố ước số cho số lớn:")
for num in large_numbers:
    div_count = number_of_divisors_optimized(num)
    print(f"d({num}) = {div_count}")
```

### Kết quả:
```
Số ước số của các số từ 1 đến 20:
d(1) = 1
d(2) = 2
d(3) = 2
d(4) = 3
d(5) = 2
d(6) = 4
d(7) = 2
d(8) = 4
d(9) = 3
d(10) = 4
d(11) = 2
d(12) = 6
d(13) = 2
d(14) = 4
d(15) = 4
d(16) = 5
d(17) = 2
d(18) = 6
d(19) = 2
d(20) = 6
```

## Tổng các ước số

Chúng ta có thể sử dụng lập luận tương tự như phần trước.

* **Nếu chỉ có một thừa số nguyên tố phân biệt** $n = p_1^{e_1}$, thì tổng là:

$$1 + p_1 + p_1^2 + \dots + p_1^{e_1} = \frac{p_1^{e_1 + 1} - 1}{p_1 - 1}$$

* **Nếu có hai thừa số nguyên tố phân biệt** $n = p_1^{e_1} \cdot p_2^{e_2}$, thì chúng ta có thể lập bảng tương tự như trước. Sự khác biệt duy nhất là bây giờ chúng ta muốn tính tổng thay vì đếm các phần tử. Dễ dàng thấy rằng tổng của mỗi sự kết hợp có thể được biểu thị bằng:

$$\left(1 + p_1 + p_1^2 + \dots + p_1^{e_1}\right) \cdot \left(1 + p_2 + p_2^2 + \dots + p_2^{e_2}\right)$$

$$= \frac{p_1^{e_1 + 1} - 1}{p_1 - 1} \cdot \frac{p_2^{e_2 + 1} - 1}{p_2 - 1}$$

* **Tổng quát**, đối với $n = p_1^{e_1} \cdot p_2^{e_2} \cdots p_k^{e_k}$, chúng ta nhận được công thức:

$$\sigma(n) = \frac{p_1^{e_1 + 1} - 1}{p_1 - 1} \cdot \frac{p_2^{e_2 + 1} - 1}{p_2 - 1} \cdots \frac{p_k^{e_k + 1} - 1}{p_k - 1}$$

### Cài đặt

#### Code C++
```cpp
long long SumOfDivisors(long long num) {
    long long total = 1;

    for (int i = 2; (long long)i * i <= num; i++) {
        if (num % i == 0) {
            int e = 0;
            do {
                e++;
                num /= i;
            } while (num % i == 0);

            long long sum = 0, pow = 1;
            do {
                sum += pow;
                pow *= i;
            } while (e-- > 0);
            total *= sum;
        }
    }
    if (num > 1) {
        total *= (1 + num);
    }
    return total;
}
```

#### Code Python
```python
def sum_of_divisors(n):
    """
    Tính tổng các ước số của n
    Độ phức tạp: O(√n)
    """
    if n <= 0:
        return 0
    if n == 1:
        return 1
    
    total = 1
    i = 2
    
    while i * i <= n:
        if n % i == 0:
            e = 0
            temp_n = n
            while temp_n % i == 0:
                e += 1
                temp_n //= i
            n = temp_n
            
            # Tính (i^(e+1) - 1) / (i - 1)
            sum_powers = (pow(i, e + 1) - 1) // (i - 1)
            total *= sum_powers
        i += 1
    
    # Nếu n > 1 thì n là thừa số nguyên tố
    if n > 1:
        total *= (1 + n)
    
    return total

def sum_of_divisors_optimized(n):
    """
    Phiên bản tối ưu cho tổng ước số
    """
    if n <= 0:
        return 0
    if n == 1:
        return 1
    
    total = 1
    
    # Xử lý thừa số 2
    if n % 2 == 0:
        e = 0
        while n % 2 == 0:
            e += 1
            n //= 2
        # (2^(e+1) - 1) / (2 - 1) = 2^(e+1) - 1
        sum_powers = (1 << (e + 1)) - 1
        total *= sum_powers
    
    # Xử lý các thừa số lẻ
    i = 3
    while i * i <= n:
        if n % i == 0:
            e = 0
            while n % i == 0:
                e += 1
                n //= i
            sum_powers = (pow(i, e + 1) - 1) // (i - 1)
            total *= sum_powers
        i += 2
    
    # Nếu n > 1 thì n là thừa số nguyên tố lớn
    if n > 1:
        total *= (1 + n)
    
    return total

def get_all_divisors(n):
    """
    Lấy tất cả ước số của n (để kiểm tra)
    """
    divisors = []
    for i in range(1, int(n**0.5) + 1):
        if n % i == 0:
            divisors.append(i)
            if i != n // i:
                divisors.append(n // i)
    return sorted(divisors)

# Ví dụ sử dụng
print("Tổng ước số của các số từ 1 đến 20:")
for i in range(1, 21):
    sigma_i = sum_of_divisors(i)
    divisors = get_all_divisors(i)
    print(f"σ({i}) = {sigma_i}, ước số: {divisors}, tổng: {sum(divisors)}")

# Kiểm tra với số lớn
large_numbers = [100, 1000, 12345]
print(f"\nTổng ước số cho số lớn:")
for num in large_numbers:
    sigma_num = sum_of_divisors_optimized(num)
    print(f"σ({num}) = {sigma_num}")
```

### Kết quả:
```
Tổng ước số của các số từ 1 đến 20:
σ(1) = 1, ước số: [1], tổng: 1
σ(2) = 3, ước số: [1, 2], tổng: 3
σ(3) = 4, ước số: [1, 3], tổng: 4
σ(4) = 7, ước số: [1, 2, 4], tổng: 7
σ(5) = 6, ước số: [1, 5], tổng: 6
σ(6) = 12, ước số: [1, 2, 3, 6], tổng: 12
σ(7) = 8, ước số: [1, 7], tổng: 8
σ(8) = 15, ước số: [1, 2, 4, 8], tổng: 15
σ(9) = 13, ước số: [1, 3, 9], tổng: 13
σ(10) = 18, ước số: [1, 2, 5, 10], tổng: 18
σ(11) = 12, ước số: [1, 11], tổng: 12
σ(12) = 28, ước số: [1, 2, 3, 4, 6, 12], tổng: 28
σ(13) = 14, ước số: [1, 13], tổng: 14
σ(14) = 24, ước số: [1, 2, 7, 14], tổng: 24
σ(15) = 24, ước số: [1, 3, 5, 15], tổng: 24
σ(16) = 31, ước số: [1, 2, 4, 8, 16], tổng: 31
σ(17) = 18, ước số: [1, 17], tổng: 18
σ(18) = 39, ước số: [1, 2, 3, 6, 9, 18], tổng: 39
σ(19) = 20, ước số: [1, 19], tổng: 20
σ(20) = 42, ước số: [1, 2, 4, 5, 10, 20], tổng: 42
```

## Hàm nhân tính

Một hàm nhân tính là một hàm $f(x)$ thỏa mãn

$$f(a \cdot b) = f(a) \cdot f(b)$$

nếu $a$ và $b$ là nguyên tố cùng nhau.

Cả $d(n)$ và $\sigma(n)$ đều là các hàm nhân tính.

Các hàm nhân tính có rất nhiều tính chất thú vị, có thể rất hữu ích trong các bài toán lý thuyết số. Ví dụ, tích chập Dirichlet của hai hàm nhân tính cũng là một hàm nhân tính.

### Tính chất của hàm nhân tính

#### Code Python
```python
def gcd(a, b):
    """Tính ước chung lớn nhất"""
    while b:
        a, b = b, a % b
    return a

def is_multiplicative_function(func, test_range=20):
    """
    Kiểm tra xem một hàm có phải là hàm nhân tính không
    """
    print(f"Kiểm tra tính nhân tính của hàm {func.__name__}:")
    
    for a in range(1, test_range):
        for b in range(1, test_range):
            if gcd(a, b) == 1:  # a và b nguyên tố cùng nhau
                f_ab = func(a * b)
                f_a_times_f_b = func(a) * func(b)
                
                if f_ab != f_a_times_f_b:
                    print(f"Không nhân tính: f({a}×{b}) = {f_ab} ≠ {f_a_times_f_b} = f({a})×f({b})")
                    return False
    
    print("✓ Hàm là nhân tính")
    return True

# Kiểm tra tính nhân tính
is_multiplicative_function(number_of_divisors, 15)
print()
is_multiplicative_function(sum_of_divisors, 15)
```

## Tính số ước số và tổng ước số cho nhiều số

Nếu cần tính cho nhiều số, chúng ta có thể sử dụng thuật toán sàng:

#### Code Python
```python
def divisor_sieve(n):
    """
    Tính số ước số cho tất cả số từ 1 đến n
    Độ phức tạp: O(n log n)
    """
    d = [0] * (n + 1)
    
    for i in range(1, n + 1):
        for j in range(i, n + 1, i):
            d[j] += 1
    
    return d

def sum_divisor_sieve(n):
    """
    Tính tổng ước số cho tất cả số từ 1 đến n
    Độ phức tạp: O(n log n)
    """
    sigma = [0] * (n + 1)
    
    for i in range(1, n + 1):
        for j in range(i, n + 1, i):
            sigma[j] += i
    
    return sigma

def efficient_divisor_sieve(n):
    """
    Sàng hiệu quả cho số ước số và tổng ước số
    Sử dụng phân tích thừa số nguyên tố
    """
    # Tìm thừa số nguyên tố nhỏ nhất
    spf = list(range(n + 1))  # smallest prime factor
    for i in range(2, int(n**0.5) + 1):
        if spf[i] == i:  # i là số nguyên tố
            for j in range(i * i, n + 1, i):
                if spf[j] == j:
                    spf[j] = i
    
    # Tính số ước số và tổng ước số
    d = [0] * (n + 1)
    sigma = [0] * (n + 1)
    d[1] = sigma[1] = 1
    
    for i in range(2, n + 1):
        p = spf[i]
        if i == p:  # i là số nguyên tố
            d[i] = 2
            sigma[i] = 1 + i
        else:
            # Tìm lũy thừa cao nhất của p chia hết i
            temp = i
            e = 0
            while temp % p == 0:
                temp //= p
                e += 1
            
            # i = p^e * temp, với gcd(p^e, temp) = 1
            pe = pow(p, e)
            d[i] = d[pe] * d[temp]
            sigma[i] = sigma[pe] * sigma[temp]
    
    return d, sigma

# So sánh các phương pháp
def compare_sieve_methods(n):
    """So sánh hiệu suất các phương pháp sàng"""
    import time
    
    print(f"So sánh các phương pháp sàng với n = {n}:")
    
    # Phương pháp sàng đơn giản
    start = time.time()
    d1 = divisor_sieve(n)
    sigma1 = sum_divisor_sieve(n)
    simple_time = time.time() - start
    
    # Phương pháp hiệu quả
    start = time.time()
    d2, sigma2 = efficient_divisor_sieve(n)
    efficient_time = time.time() - start
    
    print(f"Sàng đơn giản: {simple_time:.4f}s")
    print(f"Sàng hiệu quả: {efficient_time:.4f}s")
    print(f"Tỷ lệ tăng tốc: {simple_time/efficient_time:.2f}x")
    
    # Kiểm tra tính đúng đắn
    assert d1 == d2
    assert sigma1 == sigma2
    print("✓ Kết quả đúng")
    
    return d2, sigma2

# Test với n = 1000
d_values, sigma_values = compare_sieve_methods(1000)

print(f"\nSố ước số và tổng ước số cho số từ 1 đến 20:")
for i in range(1, 21):
    print(f"d({i}) = {d_values[i]}, σ({i}) = {sigma_values[i]}")
```

## Ứng dụng thực tế

### 1. Số hoàn hảo và số thân thiện

#### Code Python
```python
def find_perfect_numbers(limit):
    """
    Tìm các số hoàn hảo trong phạm vi cho trước
    Số hoàn hảo: σ(n) - n = n, tức σ(n) = 2n
    """
    perfect_numbers = []
    
    for n in range(1, limit + 1):
        sigma_n = sum_of_divisors(n)
        if sigma_n == 2 * n:
            perfect_numbers.append(n)
            divisors = get_all_divisors(n)
            proper_divisors = [d for d in divisors if d != n]
            print(f"{n} là số hoàn hảo: {' + '.join(map(str, proper_divisors))} = {sum(proper_divisors)}")
    
    return perfect_numbers

def find_amicable_numbers(limit):
    """
    Tìm các cặp số thân thiện
    Hai số a, b thân thiện nếu σ(a) - a = b và σ(b) - b = a
    """
    amicable_pairs = []
    
    for a in range(1, limit + 1):
        sigma_a = sum_of_divisors(a)
        b = sigma_a - a  # Tổng ước số thực sự của a
        
        if b > a and b <= limit:  # Tránh trùng lặp và vượt giới hạn
            sigma_b = sum_of_divisors(b)
            if sigma_b - b == a:
                amicable_pairs.append((a, b))
                print(f"({a}, {b}) là cặp số thân thiện:")
                print(f"  Tổng ước số thực sự của {a}: {sigma_a - a} = {b}")
                print(f"  Tổng ước số thực sự của {b}: {sigma_b - b} = {a}")
    
    return amicable_pairs

print("Số hoàn hảo nhỏ hơn 10000:")
perfect = find_perfect_numbers(10000)
print(f"Tìm thấy: {perfect}")

print(f"\nCặp số thân thiện nhỏ hơn 10000:")
amicable = find_amicable_numbers(10000)
print(f"Tìm thấy: {amicable}")
```

### 2. Phân tích độ phức tạp thuật toán

#### Code Python
```python
def analyze_algorithm_complexity():
    """
    Phân tích số phép chia trong thuật toán Euclid
    """
    def extended_gcd_count_ops(a, b):
        """GCD mở rộng với đếm số phép toán"""
        if b == 0:
            return a, 1, 0, 0  # gcd, x, y, operations
        
        ops = 1
        gcd_val, x1, y1, sub_ops = extended_gcd_count_ops(b, a % b)
        ops += sub_ops
        
        x = y1
        y = x1 - (a // b) * y1
        
        return gcd_val, x, y, ops
    
    print("Phân tích số phép chia trong thuật toán Euclid:")
    test_pairs = [(48, 18), (252, 105), (1071, 462), (3780, 3528)]
    
    for a, b in test_pairs:
        gcd_val, x, y, ops = extended_gcd_count_ops(a, b)
        d_a = number_of_divisors(a)
        d_b = number_of_divisors(b)
        
        print(f"gcd({a}, {b}) = {gcd_val}")
        print(f"  Số phép chia: {ops}")
        print(f"  d({a}) = {d_a}, d({b}) = {d_b}")
        print(f"  Tỷ lệ ops/log(min(a,b)): {ops/math.log2(min(a,b)):.2f}")

import math
analyze_algorithm_complexity()
```

### 3. Ứng dụng trong mật mã học

#### Code Python
```python
def cryptographic_applications():
    """
    Ứng dụng trong mật mã học - phân tích khó khăn phân tích thừa số
    """
    def trial_division_complexity(n):
        """Đo độ phức tạp phân tích thừa số bằng chia thử"""
        operations = 0
        factors = []
        
        i = 2
        while i * i <= n:
            while n % i == 0:
                factors.append(i)
                n //= i
                operations += 1
            i += 1
            operations += 1
        
        if n > 1:
            factors.append(n)
        
        return factors, operations
    
    # Phân tích một số có cấu trúc đặc biệt
    test_numbers = [
        77,      # 7 × 11 (dễ phân tích)
        187,     # 11 × 17 
        1403,    # 23 × 61
        32749,   # 181 × 181 (số chính phương)
        65537,   # Số nguyên tố Fermat
    ]
    
    print("Phân tích độ phức tạp phân tích thừa số:")
    
    for n in test_numbers:
        factors, ops = trial_division_complexity(n)
        d_n = number_of_divisors(n)
        sigma_n = sum_of_divisors(n)
        
        print(f"n = {n}:")
        print(f"  Thừa số: {factors}")
        print(f"  Số phép toán: {ops}")
        print(f"  d(n) = {d_n}, σ(n) = {sigma_n}")
        print(f"  Tỷ lệ ops/√n: {ops/math.sqrt(n):.4f}")
        print()

cryptographic_applications()
```

## Bài tập nâng cao

### 1. Tối ưu hóa thuật toán sàng

#### Code Python
```python
def advanced_divisor_sieve(n):
    """
    Sàng tối ưu cao cho số ước số và tổng ước số
    Sử dụng kỹ thuật phân đoạn và song song hóa concept
    """
    import math
    
    # Sàng số nguyên tố đến √n
    sqrt_n = int(math.sqrt(n)) + 1
    is_prime = [True] * sqrt_n
    primes = []
    
    for i in range(2, sqrt_n):
        if is_prime[i]:
            primes.append(i)
            for j in range(i * i, sqrt_n, i):
                is_prime[j] = False
    
    # Khởi tạo mảng kết quả
    d = [1] * (n + 1)
    sigma = [1] * (n + 1)
    
    # Xử lý từng số nguyên tố
    for p in primes:
        power = p
        while power <= n:
            # Cập nhật cho tất cả bội số của power
            for multiple in range(power, n + 1, power):
                # Đếm số lần p chia hết multiple
                temp = multiple
                e = 0
                while temp % p == 0:
                    temp //= p
                    e += 1
                
                if e > 0:
                    # Loại bỏ ảnh hưởng cũ của p^(e-1)
                    old_contribution_d = e
                    old_contribution_sigma = (pow(p, e) - 1) // (p - 1)
                    
                    # Thêm ảnh hưởng mới của p^e
                    new_contribution_d = e + 1
                    new_contribution_sigma = (pow(p, e + 1) - 1) // (p - 1)
                    
                    # Cập nhật nếu đây là lần đầu gặp p trong multiple
                    if temp * pow(p, e) == multiple:
                        d[multiple] = d[temp] * new_contribution_d
                        sigma[multiple] = sigma[temp] * new_contribution_sigma
            
            power *= p
    
    return d, sigma

def benchmark_divisor_functions():
    """Đo hiệu suất các thuật toán khác nhau"""
    import time
    
    sizes = [100, 500, 1000, 2000]
    
    for n in sizes:
        print(f"\nBenchmark với n = {n}:")
        
        # Thuật toán đơn lẻ
        start = time.time()
        d_individual = [number_of_divisors(i) for i in range(1, n + 1)]
        individual_time = time.time() - start
        
        # Thuật toán sàng cơ bản
        start = time.time()
        d_basic = divisor_sieve(n)
        basic_time = time.time() - start
        
        # Thuật toán sàng hiệu quả
        start = time.time()
        d_efficient, sigma_efficient = efficient_divisor_sieve(n)
        efficient_time = time.time() - start
        
        print(f"  Đơn lẻ: {individual_time:.4f}s")
        print(f"  Sàng cơ bản: {basic_time:.4f}s")
        print(f"  Sàng hiệu quả: {efficient_time:.4f}s")
        print(f"  Tăng tốc: {individual_time/efficient_time:.1f}x")
        
        # Kiểm tra tính đúng
        assert d_individual == d_basic[1:]
        assert d_individual == d_efficient[1:]

benchmark_divisor_functions()
```

## Bài tập thực hành

### Bài tập cơ bản:
1. **Số có nhiều ước nhất**: Tìm số nhỏ hơn N có nhiều ước số nhất.
2. **Cặp số có cùng số ước**: Tìm tất cả cặp số liên tiếp có cùng số ước số.
3. **Số có tổng ước bằng n**: Tìm tất cả số có tổng ước số bằng n cho trước.

### Bài tập nâng cao:
4. **Hàm Möbius**: Cài đặt hàm Möbius và chứng minh tính nhân tính.
5. **Tích chập Dirichlet**: Cài đặt phép tích chập Dirichlet của hai hàm số học.
6. **Sàng tối ưu**: Tối ưu hóa thuật toán sàng cho không gian bộ nhớ hạn chế.

### Bài tập thực hành trực tuyến:
- [SPOJ - COMDIV](https://www.spoj.com/problems/COMDIV/)
- [SPOJ - DIVSUM](https://www.spoj.com/problems/DIVSUM/)
- [SPOJ - DIVSUM2](https://www.spoj.com/problems/DIVSUM2/)
- [Codeforces - Divisors](https://codeforces.com/problemset/tags/number%20theory)
- [AtCoder - Mathematical Problems](https://atcoder.jp/contests/abc/tasks)

## Tài liệu tham khảo

- [CP-Algorithms: Number of divisors / sum of divisors](https://cp-algorithms.com/algebra/divisors.html)
- Hardy, G. H. & Wright, E. M. "An Introduction to the Theory of Numbers"
- Rosen, Kenneth H. "Elementary Number Theory and Its Applications"
- Apostol, Tom M. "Introduction to Analytic Number Theory"