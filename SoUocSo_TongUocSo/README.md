# Số Ước Số / Tổng Ước Số (Number of Divisors / Sum of Divisors)

Trong bài viết này, chúng ta thảo luận về cách tính số lượng ước số $d(n)$ và tổng các ước số $\sigma(n)$ của một số nguyên dương $n$ cho trước.

## Số lượng ước số

Rõ ràng là phân tích thừa số nguyên tố của một ước số $d$ phải là tập con của phân tích thừa số nguyên tố của $n$. Ví dụ: $6 = 2 \cdot 3$ là ước số của $60 = 2^2 \cdot 3 \cdot 5$. Do đó, chúng ta chỉ cần tìm tất cả các tập con khác nhau của phân tích thừa số nguyên tố của $n$.

Thông thường, số lượng tập con là $2^x$ đối với một tập hợp có $x$ phần tử. Tuy nhiên, điều này không còn đúng nữa khi có các phần tử lặp lại trong tập hợp. Trong trường hợp của chúng ta, một số thừa số nguyên tố có thể xuất hiện nhiều lần trong phân tích thừa số nguyên tố của $n$.

Nếu một thừa số nguyên tố $p$ xuất hiện $e$ lần trong phân tích thừa số nguyên tố của $n$, thì chúng ta có thể sử dụng thừa số $p$ tối đa $e$ lần trong tập con. Điều này có nghĩa là chúng ta có $e+1$ lựa chọn.

Do đó, nếu phân tích thừa số nguyên tố của $n$ là $n = p_1^{e_1} \cdot p_2^{e_2} \cdots p_k^{e_k}$, trong đó $p_i$ là các số nguyên tố phân biệt, thì số lượng ước số là:

$$d(n) = (e_1 + 1) \cdot (e_2 + 1) \cdots (e_k + 1)$$

Một cách hiểu về điều này như sau:

• **Nếu chỉ có một thừa số nguyên tố phân biệt** $n = p_1^{e_1}$, thì rõ ràng có $e_1 + 1$ ước số $(1, p_1, p_1^2, \dots, p_1^{e_1})$.

• **Nếu có hai thừa số nguyên tố phân biệt** $n = p_1^{e_1} \cdot p_2^{e_2}$, bạn có thể sắp xếp tất cả các ước số dưới dạng bảng:

$$\begin{array}{c|ccccc} 
& 1 & p_2 & p_2^2 & \dots & p_2^{e_2} \\\\
\hline 
1 & 1 & p_2 & p_2^2 & \dots & p_2^{e_2} \\\\ 
p_1 & p_1 & p_1 \cdot p_2 & p_1 \cdot p_2^2 & \dots & p_1 \cdot p_2^{e_2} \\\\ 
p_1^2 & p_1^2 & p_1^2 \cdot p_2 & p_1^2 \cdot p_2^2 & \dots & p_1^2 \cdot p_2^{e_2} \\\\ 
\vdots & \vdots & \vdots & \vdots & \ddots & \vdots \\\\ 
p_1^{e_1} & p_1^{e_1} & p_1^{e_1} \cdot p_2 & p_1^{e_1} \cdot p_2^2 & \dots & p_1^{e_1} \cdot p_2^{e_2} \\\\ 
\end{array}$$

Vậy số lượng ước số là $(e_1 + 1) \cdot (e_2 + 1)$.

• **Tương tự**, ta có thể đưa ra lập luận tương tự nếu có nhiều hơn hai thừa số nguyên tố phân biệt.

### Cài đặt

```python
def count_divisors(n):
    """
    Đếm số lượng ước số của n
    Độ phức tạp: O(sqrt(n))
    """
    total = 1
    i = 2
    
    while i * i <= n:
        if n % i == 0:
            # Đếm số mũ của thừa số nguyên tố i
            e = 0
            while n % i == 0:
                e += 1
                n //= i
            total *= (e + 1)
        i += 1
    
    # Nếu n > 1, thì n là số nguyên tố với mũ 1
    if n > 1:
        total *= 2
    
    return total

# Ví dụ sử dụng
print(f"Số ước số của 12: {count_divisors(12)}")  # 12 = 2^2 * 3^1 -> (2+1)(1+1) = 6
print(f"Số ước số của 60: {count_divisors(60)}")  # 60 = 2^2 * 3^1 * 5^1 -> (2+1)(1+1)(1+1) = 12
print(f"Số ước số của 100: {count_divisors(100)}")  # 100 = 2^2 * 5^2 -> (2+1)(2+1) = 9
```

**Kết quả:**
```
Số ước số của 12: 6
Số ước số của 60: 12
Số ước số của 100: 9
```

## Tổng các ước số

Chúng ta có thể sử dụng lập luận tương tự như phần trước.

• **Nếu chỉ có một thừa số nguyên tố phân biệt** $n = p_1^{e_1}$, thì tổng là:
  $$1 + p_1 + p_1^2 + \dots + p_1^{e_1} = \frac{p_1^{e_1 + 1} - 1}{p_1 - 1}$$

• **Nếu có hai thừa số nguyên tố phân biệt** $n = p_1^{e_1} \cdot p_2^{e_2}$, chúng ta có thể tạo bảng tương tự như trước. Điểm khác biệt duy nhất là bây giờ chúng ta muốn tính tổng thay vì đếm các phần tử. Dễ thấy rằng tổng của mỗi tổ hợp có thể được biểu diễn như:

  $$\left(1 + p_1 + p_1^2 + \dots + p_1^{e_1}\right) \cdot \left(1 + p_2 + p_2^2 + \dots + p_2^{e_2}\right)$$
  
  $$= \frac{p_1^{e_1 + 1} - 1}{p_1 - 1} \cdot \frac{p_2^{e_2 + 1} - 1}{p_2 - 1}$$

• **Tổng quát**, với $n = p_1^{e_1} \cdot p_2^{e_2} \cdots p_k^{e_k}$, chúng ta nhận được công thức:

  $$\sigma(n) = \frac{p_1^{e_1 + 1} - 1}{p_1 - 1} \cdot \frac{p_2^{e_2 + 1} - 1}{p_2 - 1} \cdots \frac{p_k^{e_k + 1} - 1}{p_k - 1}$$

### Cài đặt

```python
def sum_of_divisors(n):
    """
    Tính tổng các ước số của n
    Độ phức tạp: O(sqrt(n))
    """
    total = 1
    i = 2
    original_n = n
    
    while i * i <= n:
        if n % i == 0:
            # Đếm số mũ của thừa số nguyên tố i
            e = 0
            while n % i == 0:
                e += 1
                n //= i
            
            # Tính (i^(e+1) - 1) / (i - 1) = 1 + i + i^2 + ... + i^e
            sum_powers = 0
            power = 1
            for _ in range(e + 1):
                sum_powers += power
                power *= i
            
            total *= sum_powers
        i += 1
    
    # Nếu n > 1, thì n là số nguyên tố với mũ 1
    if n > 1:
        total *= (1 + n)
    
    return total

# Phiên bản tối ưu hơn
def sum_of_divisors_optimized(n):
    """
    Phiên bản tối ưu sử dụng công thức geometric series
    """
    total = 1
    i = 2
    
    while i * i <= n:
        if n % i == 0:
            e = 0
            while n % i == 0:
                e += 1
                n //= i
            
            # Sử dụng công thức geometric series: (p^(e+1) - 1) / (p - 1)
            total *= (pow(i, e + 1) - 1) // (i - 1)
        i += 1
    
    if n > 1:
        total *= (1 + n)
    
    return total

# Ví dụ sử dụng
print(f"Tổng ước số của 12: {sum_of_divisors(12)}")  # Ước số: 1,2,3,4,6,12 -> tổng = 28
print(f"Tổng ước số của 60: {sum_of_divisors(60)}")  # Tổng = 168
print(f"Tổng ước số của 100: {sum_of_divisors(100)}")  # Tổng = 217

# So sánh với phiên bản tối ưu
print(f"Tổng ước số của 12 (tối ưu): {sum_of_divisors_optimized(12)}")
print(f"Tổng ước số của 60 (tối ưu): {sum_of_divisors_optimized(60)}")
print(f"Tổng ước số của 100 (tối ưu): {sum_of_divisors_optimized(100)}")
```

**Kết quả:**
```
Tổng ước số của 12: 28
Tổng ước số của 60: 168  
Tổng ước số của 100: 217
Tổng ước số của 12 (tối ưu): 28
Tổng ước số của 60 (tối ưu): 168
Tổng ước số của 100 (tối ưu): 217
```

## Hàm nhân tính (Multiplicative Functions)

Một hàm nhân tính là hàm $f(x)$ thỏa mãn:

$$f(a \cdot b) = f(a) \cdot f(b)$$

nếu $a$ và $b$ nguyên tố cùng nhau.

Cả $d(n)$ và $\sigma(n)$ đều là các hàm nhân tính.

Các hàm nhân tính có rất nhiều tính chất thú vị, có thể rất hữu ích trong các bài toán lý thuyết số. Ví dụ, tích chập Dirichlet của hai hàm nhân tính cũng là hàm nhân tính.

### Ví dụ về tính chất nhân tính

```python
def demonstrate_multiplicative_property():
    """
    Chứng minh tính chất nhân tính của d(n) và σ(n)
    """
    # Chọn hai số nguyên tố cùng nhau
    a, b = 9, 8  # gcd(9,8) = 1
    
    print(f"a = {a}, b = {b}")
    print(f"gcd({a}, {b}) = {gcd(a, b)}")
    print()
    
    # Kiểm tra tính chất nhân tính của d(n)
    d_a = count_divisors(a)
    d_b = count_divisors(b)
    d_ab = count_divisors(a * b)
    
    print(f"d({a}) = {d_a}")
    print(f"d({b}) = {d_b}")
    print(f"d({a} × {b}) = d({a * b}) = {d_ab}")
    print(f"d({a}) × d({b}) = {d_a} × {d_b} = {d_a * d_b}")
    print(f"Tính chất nhân tính d(n): {d_ab == d_a * d_b}")
    print()
    
    # Kiểm tra tính chất nhân tính của σ(n)
    s_a = sum_of_divisors(a)
    s_b = sum_of_divisors(b)
    s_ab = sum_of_divisors(a * b)
    
    print(f"σ({a}) = {s_a}")
    print(f"σ({b}) = {s_b}")
    print(f"σ({a} × {b}) = σ({a * b}) = {s_ab}")
    print(f"σ({a}) × σ({b}) = {s_a} × {s_b} = {s_a * s_b}")
    print(f"Tính chất nhân tính σ(n): {s_ab == s_a * s_b}")

def gcd(a, b):
    """Tính ước chung lớn nhất"""
    while b:
        a, b = b, a % b
    return a

# Chạy demo
demonstrate_multiplicative_property()
```

**Kết quả:**
```
a = 9, b = 8
gcd(9, 8) = 1

d(9) = 3
d(8) = 4
d(9 × 8) = d(72) = 12
d(9) × d(8) = 3 × 4 = 12
Tính chất nhân tính d(n): True

σ(9) = 13
σ(8) = 15
σ(9 × 8) = σ(72) = 195
σ(9) × σ(8) = 13 × 15 = 195
Tính chất nhân tính σ(n): True
```

## Ứng dụng thực tế

### 1. Số hoàn hảo (Perfect Numbers)

```python
def is_perfect_number(n):
    """
    Kiểm tra xem n có phải là số hoàn hảo không
    Số hoàn hảo: tổng các ước số thực sự = chính nó
    """
    if n <= 1:
        return False
    
    # Tổng tất cả ước số trừ đi chính nó
    sum_proper_divisors = sum_of_divisors(n) - n
    return sum_proper_divisors == n

# Tìm các số hoàn hảo đầu tiên
print("Các số hoàn hảo đầu tiên:")
perfect_count = 0
n = 1
while perfect_count < 4:
    if is_perfect_number(n):
        print(f"{n} là số hoàn hảo")
        perfect_count += 1
    n += 1
    if n > 10000:  # Giới hạn tìm kiếm
        break
```

### 2. Số thân thiện (Amicable Numbers)

```python
def find_amicable_pairs(limit):
    """
    Tìm các cặp số thân thiện trong phạm vi [1, limit]
    """
    amicable_pairs = []
    
    for a in range(2, limit):
        # Tính tổng ước số thực sự của a
        sum_a = sum_of_divisors(a) - a
        
        if sum_a > a and sum_a <= limit:
            # Tính tổng ước số thực sự của sum_a
            sum_b = sum_of_divisors(sum_a) - sum_a
            
            if sum_b == a:
                amicable_pairs.append((a, sum_a))
    
    return amicable_pairs

# Tìm cặp số thân thiện
pairs = find_amicable_pairs(10000)
print("\nCác cặp số thân thiện:")
for pair in pairs:
    print(f"({pair[0]}, {pair[1]})")
```

### 3. Phân loại số dựa trên tổng ước số

```python
def classify_number(n):
    """
    Phân loại số dựa trên tổng ước số thực sự
    """
    if n <= 1:
        return "Không xác định"
    
    sum_proper = sum_of_divisors(n) - n
    
    if sum_proper == n:
        return "Số hoàn hảo"
    elif sum_proper > n:
        return "Số thừa"
    else:
        return "Số thiếu"

# Phân loại một số số
test_numbers = [6, 12, 28, 8, 20, 496]
print("\nPhân loại các số:")
for num in test_numbers:
    category = classify_number(num)
    proper_sum = sum_of_divisors(num) - num
    print(f"{num}: {category} (tổng ước số thực sự = {proper_sum})")
```

**Kết quả:**
```
Các số hoàn hảo đầu tiên:
6 là số hoàn hảo
28 là số hoàn hảo
496 là số hoàn hảo
8128 là số hoàn hảo

Các cặp số thân thiện:
(220, 284)
(1184, 1210)
(2620, 2924)
(5020, 5564)
(6232, 6368)

Phân loại các số:
6: Số hoàn hảo (tổng ước số thực sự = 6)
12: Số thừa (tổng ước số thực sự = 16)
28: Số hoàn hảo (tổng ước số thực sự = 28)
8: Số thiếu (tổng ước số thực sự = 7)
20: Số thừa (tổng ước số thực sự = 22)
496: Số hoàn hảo (tổng ước số thực sự = 496)
```

## Tối ưu hóa cho các trường hợp đặc biệt

### Sàng để tính số ước số cho nhiều số

```python
def sieve_divisor_count(n):
    """
    Sàng để tính số ước số cho tất cả số từ 1 đến n
    Độ phức tạp: O(n log n)
    """
    divisor_count = [0] * (n + 1)
    
    for i in range(1, n + 1):
        for j in range(i, n + 1, i):
            divisor_count[j] += 1
    
    return divisor_count

# Ví dụ: tính số ước số cho các số từ 1 đến 20
div_counts = sieve_divisor_count(20)
print("Số ước số từ 1 đến 20:")
for i in range(1, 21):
    print(f"d({i}) = {div_counts[i]}")
```

### Tối ưu hóa cho số có nhiều thừa số nhỏ

```python
def fast_divisor_functions(n, primes):
    """
    Tính nhanh d(n) và σ(n) khi biết trước các số nguyên tố nhỏ
    """
    d_n = 1
    sigma_n = 1
    temp_n = n
    
    for p in primes:
        if p * p > temp_n:
            break
            
        if temp_n % p == 0:
            e = 0
            while temp_n % p == 0:
                e += 1
                temp_n //= p
            
            d_n *= (e + 1)
            sigma_n *= (pow(p, e + 1) - 1) // (p - 1)
    
    # Nếu temp_n > 1, thì nó là số nguyên tố
    if temp_n > 1:
        d_n *= 2
        sigma_n *= (1 + temp_n)
    
    return d_n, sigma_n

# Sàng Eratosthenes để tạo danh sách số nguyên tố
def sieve_of_eratosthenes(limit):
    is_prime = [True] * (limit + 1)
    is_prime[0] = is_prime[1] = False
    
    for i in range(2, int(limit**0.5) + 1):
        if is_prime[i]:
            for j in range(i*i, limit + 1, i):
                is_prime[j] = False
    
    return [i for i in range(2, limit + 1) if is_prime[i]]

# Ví dụ sử dụng
primes = sieve_of_eratosthenes(1000)
test_num = 360
d_val, sigma_val = fast_divisor_functions(test_num, primes)
print(f"\nSố {test_num}:")
print(f"Số ước số: {d_val}")
print(f"Tổng ước số: {sigma_val}")
print(f"Kiểm tra: d({test_num}) = {count_divisors(test_num)}, σ({test_num}) = {sum_of_divisors(test_num)}")
```

## Độ phức tạp

- **Thuật toán cơ bản**: $O(\sqrt{n})$ cho mỗi truy vấn
- **Sàng cho nhiều số**: $O(n \log n)$ để tính cho tất cả số từ 1 đến n
- **Bộ nhớ**: $O(1)$ cho thuật toán cơ bản, $O(n)$ cho sàng

## Bài tập thực hành

1. **SPOJ - COMDIV**: Đếm số ước chung của hai số
2. **SPOJ - DIVSUM**: Tính tổng ước số thực sự
3. **SPOJ - DIVSUM2**: Tổng ước số với ràng buộc lớn

## Tóm tắt

- Số ước số: $d(n) = \prod_{i=1}^{k} (e_i + 1)$ với $n = \prod_{i=1}^{k} p_i^{e_i}$
- Tổng ước số: $\sigma(n) = \prod_{i=1}^{k} \frac{p_i^{e_i+1} - 1}{p_i - 1}$
- Cả hai đều là hàm nhân tính
- Ứng dụng: số hoàn hảo, số thân thiện, phân tích tính chất số học
