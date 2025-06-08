# Phân Tích Thừa Số Nguyên (Integer Factorization)

## Tổng Quan

Phân tích thừa số nguyên là bài toán tìm các thừa số nguyên tố của một số nguyên dương $n$. Đây là một trong những bài toán quan trọng nhất trong toán học và có ứng dụng rộng rãi trong mật mã học, đặc biệt là trong hệ mã RSA.

**Lưu ý:** Nếu số cần phân tích thực sự là số nguyên tố, hầu hết các thuật toán sẽ chạy rất chậm. Do đó, nên thực hiện [kiểm tra tính nguyên tố](../KiemTraSoNguyenTo/README.md) trước khi phân tích thừa số.

### Định nghĩa

Cho số nguyên dương $n$, ta cần tìm tất cả các số nguyên tố $p_1, p_2, ..., p_k$ và các số mũ tương ứng $a_1, a_2, ..., a_k$ sao cho:

$$n = p_1^{a_1} \times p_2^{a_2} \times ... \times p_k^{a_k}$$

## Các Thuật Toán Phân Tích Thừa Số

### 1. Trial Division (Chia Thử)

Đây là thuật toán cơ bản nhất. Ta chia $n$ cho mỗi ước số có thể có $d$. Có thể quan sát thấy rằng không thể có tất cả các thừa số nguyên tố của số hợp $n$ đều lớn hơn $\sqrt{n}$. Do đó, ta chỉ cần kiểm tra các ước số $2 \le d \le \sqrt{n}$, cho ta phân tích thừa số trong $O(\sqrt{n})$.

Ước số nhỏ nhất phải là số nguyên tố. Ta loại bỏ thừa số đã tìm được và tiếp tục quá trình. Nếu không thể tìm thấy ước số nào trong khoảng $[2; \sqrt{n}]$, thì chính số đó phải là số nguyên tố.

#### Cài đặt C++:

```cpp
vector<long long> trial_division1(long long n) {
    vector<long long> factorization;
    for (long long d = 2; d * d <= n; d++) {
        while (n % d == 0) {
            factorization.push_back(d);
            n /= d;
        }
    }
    if (n > 1)
        factorization.push_back(n);
    return factorization;
}
```

**Độ phức tạp:** $O(\sqrt{n})$

#### Wheel Factorization (Phân Tích Bánh Xe)

Đây là cải tiến của Trial Division. Một khi biết số không chia hết cho 2, ta không cần kiểm tra các số chẵn khác. Điều này chỉ để lại 50% số cần kiểm tra. Sau khi loại bỏ thừa số 2 và có số lẻ, ta chỉ cần bắt đầu từ 3 và chỉ đếm các số lẻ khác.

```cpp
vector<long long> trial_division2(long long n) {
    vector<long long> factorization;
    while (n % 2 == 0) {
        factorization.push_back(2);
        n /= 2;
    }
    for (long long d = 3; d * d <= n; d += 2) {
        while (n % d == 0) {
            factorization.push_back(d);
            n /= d;
        }
    }
    if (n > 1)
        factorization.push_back(n);
    return factorization;
}
```

Phương pháp này có thể được mở rộng thêm. Nếu số không chia hết cho 3, ta cũng có thể bỏ qua tất cả các bội số khác của 3. Vậy ta chỉ cần kiểm tra các số $5, 7, 11, 13, 17, 19, 23, \ldots$. Ta có thể quan sát mẫu của các số còn lại này. Ta cần kiểm tra tất cả các số có $d \bmod 6 = 1$ và $d \bmod 6 = 5$. Điều này chỉ để lại 33.3% số cần kiểm tra.

```cpp
vector<long long> trial_division3(long long n) {
    vector<long long> factorization;
    for (int d : {2, 3, 5}) {
        while (n % d == 0) {
            factorization.push_back(d);
            n /= d;
        }
    }
    static array<int, 8> increments = {4, 2, 4, 2, 4, 6, 2, 6};
    int i = 0;
    for (long long d = 7; d * d <= n; d += increments[i++]) {
        while (n % d == 0) {
            factorization.push_back(d);
            n /= d;
        }
        if (i == 8)
            i = 0;
    }
    if (n > 1)
        factorization.push_back(n);
    return factorization;
}
```

#### Sử Dụng Số Nguyên Tố Được Tính Trước

Mở rộng phương pháp wheel factorization vô hạn, ta sẽ chỉ còn lại các số nguyên tố để kiểm tra. Cách tốt để kiểm tra điều này là tính trước tất cả các số nguyên tố bằng [Sàng Eratosthenes](../SangEratosthenes/README.md) đến $\sqrt{n}$, và kiểm tra từng cái riêng lẻ.

```cpp
vector<long long> primes;

vector<long long> trial_division4(long long n) {
    vector<long long> factorization;
    for (long long d : primes) {
        if (d * d > n)
            break;
        while (n % d == 0) {
            factorization.push_back(d);
            n /= d;
        }
    }
    if (n > 1)
        factorization.push_back(n);
    return factorization;
}
```

#### Cài đặt Python tham khảo:

```python
import math

def trial_division(n):
    """
    Phân tích thừa số nguyên bằng phương pháp chia thử
    """
    factors = []
    
    # Kiểm tra thừa số 2
    while n % 2 == 0:
        factors.append(2)
        n //= 2
    
    # Kiểm tra các số lẻ từ 3 đến sqrt(n)
    for i in range(3, int(math.sqrt(n)) + 1, 2):
        while n % i == 0:
            factors.append(i)
            n //= i
    
    # Nếu n > 2 thì n là số nguyên tố
    if n > 2:
        factors.append(n)
    
    return factors
```

### 2. Fermat's Factorization Method

Ta có thể viết số hợp lẻ $n = p \cdot q$ dưới dạng hiệu của hai bình phương $n = a^2 - b^2$:

$$n = \left(\frac{p + q}{2}\right)^2 - \left(\frac{p - q}{2}\right)^2$$

Phương pháp phân tích của Fermat cố gắng khai thác thực tế này bằng cách đoán bình phương đầu tiên $a^2$, và kiểm tra phần còn lại $b^2 = a^2 - n$ có phải là số chính phương không. Nếu có, ta đã tìm được các thừa số $a - b$ và $a + b$ của $n$.

#### Cài đặt C++:

```cpp
int fermat(int n) {
    int a = ceil(sqrt(n));
    int b2 = a*a - n;
    int b = round(sqrt(b2));
    while (b * b != b2) {
        a = a + 1;
        b2 = a*a - n;
        b = round(sqrt(b2));
    }
    return a - b;
}
```

Phương pháp phân tích này có thể rất nhanh nếu hiệu số giữa hai thừa số $p$ và $q$ nhỏ. Thuật toán chạy trong thời gian $O(|p - q|)$. Tuy nhiên trong thực tế, phương pháp này hiếm khi được sử dụng. Khi các thừa số càng xa nhau, nó cực kỳ chậm.

#### Cài đặt Python tham khảo:

```python
def fermat_factorization(n):
    """
    Phân tích thừa số bằng phương pháp Fermat
    """
    if n % 2 == 0:
        return [2, n // 2]
    
    a = int(math.sqrt(n)) + 1
    b_squared = a * a - n
    
    while not is_perfect_square(b_squared):
        a += 1
        b_squared = a * a - n
        if a > (n + 1) // 2:
            return [n]  # n là số nguyên tố
    
    b = int(math.sqrt(b_squared))
    return [a - b, a + b]

def is_perfect_square(n):
    """Kiểm tra n có phải là số chính phương không"""
    if n < 0:
        return False
    root = int(math.sqrt(n))
    return root * root == n
```

### 3. Pollard's p-1 Algorithm

Rất có khả năng số $n$ có ít nhất một thừa số nguyên tố $p$ sao cho $p - 1$ là $B$-powersmooth với $B$ nhỏ. Số nguyên $m$ được gọi là $B$-powersmooth nếu mọi lũy thừa nguyên tố chia $m$ đều không vượt quá $B$.

Ý tưởng đến từ [Định lý nhỏ Fermat](../HamPhiEuler/README.md). Cho phân tích của $n$ là $n = p \cdot q$. Nó nói rằng nếu $a$ nguyên tố cùng nhau với $p$, thì:

$$a^{p - 1} \equiv 1 \pmod{p}$$

Điều này cũng có nghĩa là:

$${\left(a^{(p - 1)}\right)}^k \equiv a^{k \cdot (p - 1)} \equiv 1 \pmod{p}$$

Vậy với bất kỳ $M$ nào có $p - 1 ~|~ M$, ta biết rằng $a^M \equiv 1$. Điều này có nghĩa $a^M - 1 = p \cdot r$, và vì vậy $p ~|~ \gcd(a^M - 1, n)$.

#### Cài đặt C++:

```cpp
long long pollards_p_minus_1(long long n) {
    int B = 10;
    long long g = 1;
    while (B <= 1000000 && g < n) {
        long long a = 2 + rand() %  (n - 3);
        g = gcd(a, n);
        if (g > 1)
            return g;

        // compute a^M
        for (int p : primes) {
            if (p >= B)
                continue;
            long long p_power = 1;
            while (p_power * p <= B)
                p_power *= p;
            a = power(a, p_power, n);

            g = gcd(a - 1, n);
            if (g > 1 && g < n)
                return g;
        }
        B *= 2;
    }
    return 1;
}
```

Lưu ý rằng đây là thuật toán xác suất. Hệ quả của điều này là có khả năng thuật toán hoàn toàn không thể tìm được thừa số.

**Độ phức tạp:** $O(B \log B \log^2 n)$ mỗi lần lặp.

#### Cài đặt Python tham khảo:

```python
def gcd(a, b):
    """Tính ước chung lớn nhất"""
    while b:
        a, b = b, a % b
    return a

def pollard_p_minus_1(n, B=100):
    """
    Thuật toán Pollard's p-1
    """
    a = 2
    
    # Tính a = 2^(lcm(1,2,...,B)) mod n
    for j in range(2, B + 1):
        a = pow(a, j, n)
        
        # Kiểm tra gcd sau mỗi bước
        g = gcd(a - 1, n)
        if 1 < g < n:
            return [g, n // g]
        elif g == n:
            return None  # Thất bại
    
    return None  # Không tìm thấy thừa số
```

### 4. Pollard's Rho Algorithm

Thuật toán Rho của Pollard là một thuật toán phân tích khác từ John Pollard.

Cho phân tích nguyên tố của số là $n = p q$. Thuật toán xem xét chuỗi giả ngẫu nhiên $\{x_i\} = \{x_0,~f(x_0),~f(f(x_0)),~\dots\}$ trong đó $f$ là hàm đa thức, thường chọn $f(x) = (x^2 + c) \bmod n$ với $c = 1$.

Ta không quan tâm đến chuỗi $\{x_i\}$. Ta quan tâm hơn đến chuỗi $\{x_i \bmod p\}$. Vì $f$ là hàm đa thức và tất cả giá trị trong khoảng $[0;~p)$, chuỗi này cuối cùng sẽ hội tụ thành vòng lặp.

#### Floyd's Cycle-Finding Algorithm

Thuật toán này tìm vòng lặp bằng cách sử dụng hai con trỏ di chuyển trên chuỗi với tốc độ khác nhau. Trong mỗi lần lặp, con trỏ đầu tiên sẽ tiến một phần tử, trong khi con trỏ thứ hai tiến đến mọi phần tử khác.

```cpp
long long mult(long long a, long long b, long long mod) {
    return (__int128)a * b % mod;
}

long long f(long long x, long long c, long long mod) {
    return (mult(x, x, mod) + c) % mod;
}

long long rho(long long n, long long x0=2, long long c=1) {
    long long x = x0;
    long long y = x0;
    long long g = 1;
    while (g == 1) {
        x = f(x, c, n);
        y = f(y, c, n);
        y = f(y, c, n);
        g = gcd(abs(x - y), n);
    }
    return g;
}
```

Nếu GCC không khả dụng, bạn có thể sử dụng ý tưởng tương tự như [lũy thừa nhị phân](../../NguyenTacCoBan/LuyThuaNhiPhan/README.md):

```cpp
long long mult(long long a, long long b, long long mod) {
    long long result = 0;
    while (b) {
        if (b & 1)
            result = (result + a) % mod;
        a = (a + a) % mod;
        b >>= 1;
    }
    return result;
}
```

#### Brent's Algorithm

Brent cài đặt phương pháp tương tự Floyd, sử dụng hai con trỏ. Khác biệt là thay vì tiến con trỏ một và hai vị trí tương ứng, chúng được tiến theo lũy thừa của hai.

```cpp
long long brent(long long n, long long x0=2, long long c=1) {
    long long x = x0;
    long long g = 1;
    long long q = 1;
    long long xs, y;

    int m = 128;
    int l = 1;
    while (g == 1) {
        y = x;
        for (int i = 1; i < l; i++)
            x = f(x, c, n);
        int k = 0;
        while (k < l && g == 1) {
            xs = x;
            for (int i = 0; i < m && i < l - k; i++) {
                x = f(x, c, n);
                q = mult(q, abs(y - x), n);
            }
            g = gcd(q, n);
            k += m;
        }
        l *= 2;
    }
    if (g == n) {
        do {
            xs = f(xs, c, n);
            g = gcd(abs(xs - y), n);
        } while (g == 1);
    }
    return g;
}
```

Sự kết hợp của trial division cho các số nguyên tố nhỏ cùng với phiên bản Brent của thuật toán Rho của Pollard tạo nên thuật toán phân tích thừa số rất mạnh mẽ.

**Độ phức tạp:** $O(\sqrt[4]{n} \log(n))$ (thời gian mong đợi).

#### Cài đặt Python tham khảo:

```python
def pollard_rho_floyd(n):
    """
    Thuật toán Pollard's Rho sử dụng Floyd's cycle detection
    """
    if n % 2 == 0:
        return 2
    
    def f(x):
        return (x * x + 1) % n
    
    x = 2
    y = 2
    d = 1
    
    while d == 1:
        x = f(x)           # Tortoise moves one step
        y = f(f(y))        # Hare moves two steps
        d = gcd(abs(x - y), n)
    
    return d if d != n else None
```

## Ứng Dụng Thực Tế

### Mật Mã RSA

Trong hệ mã RSA, bảo mật dựa trên độ khó của việc phân tích thừa số của số lớn $n = p \times q$ khi $p$ và $q$ là hai số nguyên tố lớn.

### Tìm Ước Chung Lớn Nhất

Có thể sử dụng phân tích thừa số để tính GCD một cách hiệu quả bằng cách tìm thừa số chung với số mũ nhỏ nhất.

### Số Hoàn Hảo và Số Thân Thiện

Phân tích thừa số giúp tính tổng ước số để xác định số hoàn hảo và các cặp số thân thiện.

## So Sánh Hiệu Suất

### Lựa Chọn Thuật Toán:

- **Trial Division**: Tốt cho số nhỏ (< $10^6$)
- **Wheel Factorization**: Cải tiến Trial Division
- **Fermat's Method**: Hiệu quả với số có thừa số gần nhau
- **Pollard's p-1**: Tốt khi $p-1$ smooth
- **Pollard's Rho**: Thuật toán tổng quát hiệu quả

### Độ Phức Tạp:
- **Trial Division**: $O(\sqrt{n})$
- **Pollard's Rho**: $O(n^{1/4})$ (thời gian mong đợi)
- **Quadratic Sieve**: $O(e^{\sqrt{\ln n \ln \ln n}})$

## Bài Tập Thực Hành

- [SPOJ - FACT0](https://www.spoj.com/problems/FACT0/)
- [SPOJ - FACT1](https://www.spoj.com/problems/FACT1/)
- [SPOJ - FACT2](https://www.spoj.com/problems/FACT2/)
- [GCPC 15 - Divisions](https://codeforces.com/gym/100753)

## Kết Luận

Phân tích thừa số nguyên là một bài toán cơ bản nhưng có tầm quan trọng lớn trong:

1. **Mật mã học**: Bảo mật của RSA dựa trên độ khó của bài toán này
2. **Lý thuyết số**: Hiểu cấu trúc của các số nguyên
3. **Thuật toán**: Phát triển các phương pháp tối ưu

Việc lựa chọn thuật toán phù hợp phụ thuộc vào kích thước và tính chất của số cần phân tích. Đối với các ứng dụng thực tế, thường kết hợp nhiều phương pháp để đạt hiệu quả tối ưu.
