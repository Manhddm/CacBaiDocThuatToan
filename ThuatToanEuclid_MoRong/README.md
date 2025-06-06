# Thuật toán Euclid mở rộng (Extended Euclidean Algorithm)

## Ý nghĩa

Thuật toán Euclid thông thường chỉ tính được ước chung lớn nhất (GCD) của hai số nguyên $a$ và $b$. Phiên bản mở rộng còn tìm được cách biểu diễn GCD dưới dạng tổ hợp tuyến tính của $a$ và $b$, tức là tìm các hệ số $x$ và $y$ sao cho:

$$a \cdot x + b \cdot y = \gcd(a, b)$$

Theo định lý Bézout, luôn tồn tại các hệ số như vậy. Ví dụ, $\gcd(55, 80) = 5$, ta có thể biểu diễn $5$ dưới dạng tổ hợp tuyến tính của $55$ và $80$: $55 \cdot 3 + 80 \cdot (-2) = 5$.

Dạng tổng quát hơn của bài toán này được trình bày trong bài về Phương trình Diophantine tuyến tính, dựa trên thuật toán này.

## Thuật toán

Ký hiệu $g$ là GCD của $a$ và $b$.

So với thuật toán Euclid gốc, thay đổi rất đơn giản. Khi thuật toán kết thúc với $b = 0$ và $a = g$, ta dễ dàng tìm được hệ số: $g \cdot 1 + 0 \cdot 0 = g$.

Bắt đầu từ các hệ số $(x, y) = (1, 0)$, ta đi ngược lại qua các lần gọi đệ quy. Việc cần làm là xác định cách các hệ số $x$ và $y$ thay đổi khi chuyển từ $(a, b)$ sang $(b, a \bmod b)$.

Giả sử ta đã tìm được hệ số $(x_1, y_1)$ cho $(b, a \bmod b)$:

$$b \cdot x_1 + (a \bmod b) \cdot y_1 = g$$

và muốn tìm cặp $(x, y)$ cho $(a, b)$:

$$ a \cdot x + b \cdot y = g$$

Ta có thể biểu diễn $a \bmod b$ như sau:

$$ a \bmod b = a - \left\lfloor \frac{a}{b} \right\rfloor \cdot b$$

Thay vào phương trình trên:

$$ g = b \cdot x_1 + (a - \left\lfloor \frac{a}{b} \right\rfloor \cdot b) \cdot y_1 $$

$$ g = a \cdot y_1 + b \cdot (x_1 - y_1 \cdot \left\lfloor \frac{a}{b} \right\rfloor) $$

Vậy ta có:

$$\begin{cases} x = y_1 \\ y = x_1 - y_1 \cdot \left\lfloor \frac{a}{b} \right\rfloor \end{cases} $$

## Cài đặt

```cpp
int gcd(int a, int b, int& x, int& y) {
    if (b == 0) {
        x = 1;
        y = 0;
        return a;
    }
    int x1, y1;
    int d = gcd(b, a % b, x1, y1);
    x = y1;
    y = x1 - y1 * (a / b);
    return d;
}
```

**Python:**
```python
def extended_gcd(a, b):
    """Thuật toán Euclid mở rộng đệ quy"""
    if b == 0:
        return a, 1, 0
    
    gcd, x1, y1 = extended_gcd(b, a % b)
    x = y1
    y = x1 - (a // b) * y1
    
    return gcd, x, y

# Ví dụ sử dụng:
# gcd, x, y = extended_gcd(55, 80)
# print(f"gcd({55}, {80}) = {gcd}")
# print(f"55 * {x} + 80 * {y} = {55*x + 80*y}")
```

Hàm đệ quy trên trả về GCD và gán giá trị hệ số cho `x` và `y` (tham chiếu).

Cài đặt này cho kết quả đúng cả với số nguyên âm.

## Phiên bản lặp (Iterative version)

Có thể viết thuật toán Euclid mở rộng dưới dạng lặp. Nhờ tránh đệ quy, mã sẽ chạy nhanh hơn một chút.

```cpp
int gcd(int a, int b, int& x, int& y) {
    x = 1, y = 0;
    int x1 = 0, y1 = 1, a1 = a, b1 = b;
    while (b1) {
        int q = a1 / b1;
        tie(x, x1) = make_tuple(x1, x - q * x1);
        tie(y, y1) = make_tuple(y1, y - q * y1);
        tie(a1, b1) = make_tuple(b1, a1 - q * b1);
    }
    return a1;
}
```

**Python:**
```python
def extended_gcd_iterative(a, b):
    """Thuật toán Euclid mở rộng lặp"""
    x, y = 1, 0
    x1, y1 = 0, 1
    a1, b1 = a, b
    
    while b1:
        q = a1 // b1
        x, x1 = x1, x - q * x1
        y, y1 = y1, y - q * y1
        a1, b1 = b1, a1 - q * b1
    
    return a1, x, y

# Ví dụ sử dụng:
# gcd, x, y = extended_gcd_iterative(55, 80)
# print(f"gcd({55}, {80}) = {gcd}")
# print(f"55 * {x} + 80 * {y} = {55*x + 80*y}")
```

Nếu để ý, biến `a1` và `b1` nhận giá trị giống như trong thuật toán Euclid thông thường dạng lặp. Do đó, thuật toán chắc chắn tính đúng GCD.

Để thấy thuật toán tính đúng hệ số, hãy xét các bất biến sau (trước vòng lặp và sau mỗi vòng lặp):

$$x \cdot a + y \cdot b = a_1$$

$$x_1 \cdot a + y_1 \cdot b = b_1$$

Sau mỗi vòng lặp, các biến cập nhật như sau (với $q = \frac{a_1}{b_1}$):

$$a_1' = b_1$$

$$b_1' = a_1 - q \cdot b_1$$

Từ đó, các hệ số cũng cập nhật đúng để bảo toàn bất biến. Kết thúc, $a_1$ chứa GCD, nên $x \cdot a + y \cdot b = g$.

Có thể tối ưu mã hơn nữa bằng cách bỏ biến $a_1$ và $b_1$, chỉ dùng $a$ và $b$, nhưng khi đó sẽ khó chứng minh bất biến.

## Bài tập thực hành

* UVA - 10104 - Euclid Problem
* GYM - (J) Once Upon A Time
* UVA - 12775 - Gift Dilemma

Nguồn: [cp-algorithms.com](https://cp-algorithms.com/algebra/extended-euclid-algorithm.html)