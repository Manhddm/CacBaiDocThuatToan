# Sàng Tuyến Tính (Linear Sieve)

## Mô tả bài toán

Cho một số $n$, tìm tất cả các số nguyên tố trong đoạn $[2; n]$.

Cách tiêu chuẩn để giải quyết bài toán này là sử dụng [Sàng Eratosthenes](../SangEratosthenes/README.md). Thuật toán này rất đơn giản, nhưng có độ phức tạp thời gian là $O(n \log \log n)$.

Mặc dù có nhiều thuật toán đã biết có độ phức tạp thời gian dưới tuyến tính (tức là $o(n)$), thuật toán được mô tả dưới đây thú vị bởi tính đơn giản của nó: nó không phức tạp hơn so với sàng Eratosthenes cổ điển.

Ngoài ra, thuật toán được đưa ra ở đây còn tính toán phân tích thừa số của tất cả các số trong đoạn $[2; n]$ như một hiệu ứng phụ, và điều đó có thể hữu ích trong nhiều ứng dụng thực tế.

Điểm yếu của thuật toán này là sử dụng nhiều bộ nhớ hơn so với sàng Eratosthenes cổ điển: nó yêu cầu một mảng gồm $n$ số, trong khi sàng Eratosthenes cổ điển chỉ cần $n$ bit bộ nhớ (ít hơn 32 lần).

Do đó, việc sử dụng thuật toán này chỉ có ý nghĩa đối với các số có bậc khoảng $10^7$ và không lớn hơn.

Thuật toán này được phát triển bởi Paul Pritchard. Đây là biến thể của Algorithm 3.3 trong (Pritchard, 1987).

## Thuật toán

Mục tiêu của chúng ta là tính toán thừa số nguyên tố nhỏ nhất $lp[i]$ cho mọi số $i$ trong đoạn $[2; n]$.

Ngoài ra, chúng ta cần lưu trữ danh sách tất cả các số nguyên tố được tìm thấy - gọi nó là $pr[]$.

Chúng ta sẽ khởi tạo các giá trị $lp[i]$ bằng 0, có nghĩa là chúng ta giả định tất cả các số đều là số nguyên tố. Trong quá trình thực hiện thuật toán, mảng này sẽ được điền dần.

Bây giờ chúng ta sẽ duyệt qua các số từ 2 đến $n$. Chúng ta có hai trường hợp cho số hiện tại $i$:

1. $lp[i] = 0$ - có nghĩa là $i$ là số nguyên tố, tức là chúng ta chưa tìm thấy bất kỳ thừa số nhỏ hơn nào cho nó. Do đó, chúng ta gán $lp[i] = i$ và thêm $i$ vào cuối danh sách $pr[]$.

2. $lp[i] \neq 0$ - có nghĩa là $i$ là số hợp, và thừa số nguyên tố nhỏ nhất của nó là $lp[i]$.

Trong cả hai trường hợp, chúng ta cập nhật các giá trị của $lp[]$ cho các số chia hết cho $i$. Tuy nhiên, mục tiêu của chúng ta là học cách làm điều này sao cho đặt giá trị $lp[]$ nhiều nhất một lần cho mỗi số. Chúng ta có thể làm như sau:

Hãy xem xét các số $x_j = i \cdot p_j$, trong đó $p_j$ là tất cả các số nguyên tố nhỏ hơn hoặc bằng $lp[i]$ (đây là lý do tại sao chúng ta cần lưu trữ danh sách tất cả các số nguyên tố).

Chúng ta sẽ đặt giá trị mới $lp[x_j] = p_j$ cho tất cả các số có dạng này.

Chứng minh tính đúng đắn của thuật toán này và thời gian chạy của nó có thể được tìm thấy sau phần triển khai.

## Cài đặt

### Code C++
```cpp
const int N = 10000000;
vector<int> lp(N+1);
vector<int> pr;

for (int i=2; i <= N; ++i) {
    if (lp[i] == 0) {
        lp[i] = i;
        pr.push_back(i);
    }
    for (int j = 0; i * pr[j] <= N; ++j) {
        lp[i * pr[j]] = pr[j];
        if (pr[j] == lp[i]) {
            break;
        }
    }
}
```

### Code Python
```python
def linear_sieve(n):
    """
    Sàng tuyến tính để tìm tất cả số nguyên tố từ 2 đến n
    Trả về:
    - lp: mảng chứa thừa số nguyên tố nhỏ nhất của mỗi số
    - pr: danh sách các số nguyên tố
    """
    lp = [0] * (n + 1)  # lp[i] = thừa số nguyên tố nhỏ nhất của i
    pr = []  # danh sách các số nguyên tố
    
    for i in range(2, n + 1):
        if lp[i] == 0:  # i là số nguyên tố
            lp[i] = i
            pr.append(i)
        
        # Đánh dấu các hợp số
        j = 0
        while j < len(pr) and i * pr[j] <= n:
            lp[i * pr[j]] = pr[j]
            if pr[j] == lp[i]:
                break
            j += 1
    
    return lp, pr

# Sử dụng hàm
n = 30
lp, primes = linear_sieve(n)

print(f"Các số nguyên tố từ 2 đến {n}:")
print(primes)

print(f"\nThừa số nguyên tố nhỏ nhất của mỗi số:")
for i in range(2, n + 1):
    print(f"lp[{i}] = {lp[i]}")

# Ví dụ phân tích thừa số
def factorize(x, lp):
    """
    Phân tích thừa số của x sử dụng mảng lp
    """
    factors = []
    while x > 1:
        factors.append(lp[x])
        x //= lp[x]
    return factors

# Phân tích thừa số một số số
test_numbers = [12, 18, 24, 30]
print(f"\nPhân tích thừa số:")
for num in test_numbers:
    if num <= n:
        factors = factorize(num, lp)
        print(f"{num} = {' × '.join(map(str, factors))}")
```

### Kết quả chạy:
```
Các số nguyên tố từ 2 đến 30:
[2, 3, 5, 7, 11, 13, 17, 19, 23, 29]

Thừa số nguyên tố nhỏ nhất của mỗi số:
lp[2] = 2
lp[3] = 3
lp[4] = 2
lp[5] = 5
lp[6] = 2
lp[7] = 7
lp[8] = 2
lp[9] = 3
lp[10] = 2
lp[11] = 11
lp[12] = 2
lp[13] = 13
lp[14] = 2
lp[15] = 3
lp[16] = 2
lp[17] = 17
lp[18] = 2
lp[19] = 19
lp[20] = 2
lp[21] = 3
lp[22] = 2
lp[23] = 23
lp[24] = 2
lp[25] = 5
lp[26] = 2
lp[27] = 3
lp[28] = 2
lp[29] = 29
lp[30] = 2

Phân tích thừa số:
12 = 2 × 2 × 3
18 = 2 × 3 × 3
24 = 2 × 2 × 2 × 3
30 = 2 × 3 × 5
```

## Chứng minh tính đúng đắn

Chúng ta cần chứng minh rằng thuật toán đặt tất cả các giá trị $lp[]$ một cách chính xác, và mỗi giá trị sẽ được đặt chính xác một lần. Do đó, thuật toán sẽ có thời gian chạy tuyến tính, vì tất cả các hành động còn lại của thuật toán, rõ ràng, hoạt động trong $O(n)$.

Lưu ý rằng mỗi số $i$ có chính xác một biểu diễn dưới dạng:

$$i = lp[i] \cdot x,$$

trong đó $lp[i]$ là thừa số nguyên tố nhỏ nhất của $i$, và số $x$ không có bất kỳ thừa số nguyên tố nào nhỏ hơn $lp[i]$, tức là:

$$lp[i] \leq lp[x].$$

Bây giờ, hãy so sánh điều này với các hành động của thuật toán của chúng ta: thực tế, đối với mỗi $x$, nó đi qua tất cả các số nguyên tố mà nó có thể được nhân với, tức là tất cả các số nguyên tố lên đến $lp[x]$ bao gồm, để có được các số có dạng đã cho ở trên.

Do đó, thuật toán sẽ đi qua mỗi số hợp chính xác một lần, đặt các giá trị $lp[]$ chính xác ở đó. Q.E.D.

## Độ phức tạp thời gian và bộ nhớ

Mặc dù thời gian chạy $O(n)$ tốt hơn so với $O(n \log \log n)$ của sàng Eratosthenes cổ điển, sự khác biệt giữa chúng không quá lớn. Trong thực tế, sàng tuyến tính chạy gần như nhanh bằng một triển khai điển hình của sàng Eratosthenes.

So sánh với các phiên bản tối ưu của sàng Eratosthenes, ví dụ như sàng phân đoạn, nó chậm hơn nhiều.

Xem xét yêu cầu bộ nhớ của thuật toán này - một mảng $lp[]$ có độ dài $n$, và một mảng $pr[]$ có độ dài $\frac{n}{\ln n}$, thuật toán này dường như tệ hơn sàng cổ điển về mọi mặt.

Tuy nhiên, chất lượng cứu cánh của nó là thuật toán này tính toán một mảng $lp[]$, cho phép chúng ta tìm phân tích thừa số của bất kỳ số nào trong đoạn $[2; n]$ trong thời gian theo thứ tự kích thước của phân tích thừa số này. Hơn nữa, chỉ sử dụng một mảng bổ sung sẽ cho phép chúng ta tránh phép chia khi tìm kiếm phân tích thừa số.

Biết phân tích thừa số của tất cả các số rất hữu ích cho một số nhiệm vụ, và thuật toán này là một trong số ít cho phép tìm chúng trong thời gian tuyến tính.

## Ví dụ ứng dụng

### 1. Tìm tất cả ước số của một số
```python
def get_all_divisors(x, lp):
    """
    Tìm tất cả ước số của x sử dụng phân tích thừa số
    """
    # Phân tích thừa số
    factors = {}
    temp = x
    while temp > 1:
        p = lp[temp]
        factors[p] = factors.get(p, 0) + 1
        temp //= p
    
    # Sinh tất cả ước số
    divisors = [1]
    for prime, count in factors.items():
        new_divisors = []
        for d in divisors:
            for i in range(count + 1):
                new_divisors.append(d * (prime ** i))
        divisors = new_divisors
    
    return sorted(divisors)

# Ví dụ
n = 100
lp, primes = linear_sieve(n)

test_num = 60
divisors = get_all_divisors(test_num, lp)
print(f"Các ước số của {test_num}: {divisors}")
# Kết quả: [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]
```

### 2. Đếm số ước số nguyên tố khác nhau
```python
def count_distinct_prime_factors(x, lp):
    """
    Đếm số lượng thừa số nguyên tố khác nhau của x
    """
    distinct_primes = set()
    while x > 1:
        distinct_primes.add(lp[x])
        x //= lp[x]
    return len(distinct_primes)

# Ví dụ
test_numbers = [12, 30, 60, 72]
for num in test_numbers:
    count = count_distinct_prime_factors(num, lp)
    factors = factorize(num, lp)
    unique_factors = list(set(factors))
    print(f"{num}: {len(unique_factors)} thừa số nguyên tố khác nhau: {unique_factors}")
```

### 3. Kiểm tra số hoàn hảo (Perfect Number)
```python
def is_perfect_number(x, lp):
    """
    Kiểm tra x có phải là số hoàn hảo không
    (tổng các ước số thực sự bằng chính nó)
    """
    if x <= 1:
        return False
    
    divisors = get_all_divisors(x, lp)
    # Loại bỏ chính số đó
    proper_divisors = [d for d in divisors if d != x]
    return sum(proper_divisors) == x

# Kiểm tra một số số
for i in range(1, 30):
    if is_perfect_number(i, lp):
        proper_divs = [d for d in get_all_divisors(i, lp) if d != i]
        print(f"{i} là số hoàn hảo: {' + '.join(map(str, proper_divs))} = {sum(proper_divs)}")
```

## So sánh với Sàng Eratosthenes

| Tiêu chí | Sàng Eratosthenes | Sàng Tuyến Tính |
|----------|-------------------|------------------|
| Độ phức tạp thời gian | $O(n \log \log n)$ | $O(n)$ |
| Bộ nhớ | $O(n)$ bits | $O(n)$ integers |
| Thông tin bổ sung | Chỉ số nguyên tố | Thừa số nhỏ nhất + phân tích thừa số |
| Tốc độ thực tế | Nhanh | Tương đương |
| Phù hợp cho | $n$ lớn | $n \leq 10^7$, cần phân tích thừa số |

## Tài liệu tham khảo

- Paul Pritchard, Linear Prime-Number Sieves: a Family Tree, Science of Computer Programming, vol. 9 (1987), pp.17-35.
- [CP-Algorithms: Linear Sieve](https://cp-algorithms.com/algebra/prime-sieve-linear.html)
