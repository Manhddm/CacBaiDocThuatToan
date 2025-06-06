# Thuật toán Euclid để tính ước chung lớn nhất (GCD)

## Định nghĩa

Cho hai số nguyên không âm $a$ và $b$, ta cần tìm **ước chung lớn nhất** (GCD - greatest common divisor) của chúng, tức là số lớn nhất chia hết cho cả $a$ và $b$. Thường được ký hiệu là $\gcd(a, b)$. Về mặt toán học, nó được định nghĩa là:

$$\gcd(a, b) = \max \{k > 0 : (k \mid a) \text{ và } (k \mid b) \}$$

(trong đó ký hiệu "$\mid$" nghĩa là chia hết, tức là "$k \mid a$" nghĩa là "$k$ chia hết $a$")

Khi một trong hai số là 0, còn số kia khác 0, thì ước chung lớn nhất theo định nghĩa là số còn lại. Khi cả hai số đều là 0, ước chung lớn nhất là không xác định (có thể là bất kỳ số lớn nào), nhưng để thuận tiện, ta định nghĩa nó là 0 để bảo toàn tính kết hợp của $\gcd$. Quy tắc đơn giản: nếu một trong hai số là 0, GCD là số còn lại.

Thuật toán Euclid cho phép tìm GCD của hai số $a$ và $b$ trong $O(\log \min(a, b))$. Vì hàm này **có tính kết hợp**, nên để tìm GCD của nhiều hơn hai số, ta có thể làm $\gcd(a, b, c) = \gcd(a, \gcd(b, c))$ và tiếp tục như vậy.

Thuật toán này được mô tả lần đầu trong tác phẩm "Elements" của Euclid (khoảng năm 300 TCN), nhưng có thể nó còn xuất hiện sớm hơn.

## Thuật toán

Ban đầu, thuật toán Euclid được phát biểu như sau: trừ số nhỏ hơn khỏi số lớn hơn cho đến khi một trong hai số bằng 0. Thật vậy, nếu $g$ chia hết cho $a$ và $b$, thì nó cũng chia hết cho $a-b$. Ngược lại, nếu $g$ chia hết cho $a-b$ và $b$, thì nó cũng chia hết cho $a = b + (a-b)$, nghĩa là tập các ước chung của $\{a, b\}$ và $\{b, a-b\}$ là giống nhau.

Lưu ý rằng $a$ vẫn là số lớn hơn cho đến khi $b$ được trừ khỏi nó ít nhất $\left\lfloor\frac{a}{b}\right\rfloor$ lần. Để tăng tốc, thay vì $a-b$, ta thay bằng $a-\left\lfloor\frac{a}{b}\right\rfloor b = a \bmod b$. Khi đó, thuật toán được phát biểu rất đơn giản:

$$\gcd(a, b) = \begin{cases}a,&\text{nếu }b = 0 \\ \gcd(b, a \bmod b),&\text{ngược lại.}\end{cases}$$

## Cài đặt

```cpp
int gcd (int a, int b) {
    if (b == 0)
        return a;
    else
        return gcd (b, a % b);
}
```

Sử dụng toán tử ba ngôi trong C++, ta có thể viết ngắn gọn hơn:

```cpp
int gcd (int a, int b) {
    return b ? gcd (b, a % b) : a;
}
```

Và cuối cùng, đây là phiên bản không đệ quy:

```cpp
int gcd (int a, int b) {
    while (b) {
        a %= b;
        swap(a, b);
    }
    return a;
}
```

Lưu ý: Từ C++17, `gcd` đã được cài đặt sẵn trong thư viện chuẩn C++.

## Độ phức tạp thời gian

Thời gian chạy của thuật toán được ước lượng bởi định lý Lamé, thiết lập một liên hệ bất ngờ giữa thuật toán Euclid và dãy Fibonacci:

Nếu $a > b \geq 1$ và $b < F_n$ với một số $n$, thuật toán Euclid thực hiện tối đa $n-2$ lần gọi đệ quy.

Hơn nữa, có thể chứng minh rằng giới hạn trên này là tối ưu. Khi $a = F_n$ và $b = F_{n-1}$, $gcd(a, b)$ sẽ thực hiện đúng $n-2$ lần gọi đệ quy. Nói cách khác, hai số Fibonacci liên tiếp là trường hợp tệ nhất cho thuật toán Euclid.

Vì các số Fibonacci tăng theo hàm mũ, ta có thuật toán Euclid chạy trong $O(\log \min(a, b))$.

Một cách khác để ước lượng độ phức tạp là nhận thấy rằng $a \bmod b$ với $a \geq b$ ít nhất nhỏ hơn $a$ hai lần, nên số lớn hơn giảm ít nhất một nửa mỗi vòng lặp. Khi áp dụng cho tập các số $a_1,\dots,a_n \leq C$, điều này cũng cho phép ước lượng tổng thời gian chạy là $O(n + \log C)$, thay vì $O(n \log C)$, vì mỗi vòng lặp không tầm thường giảm ứng viên GCD hiện tại ít nhất một nửa.

## Bội chung nhỏ nhất (LCM)

Tính bội chung nhỏ nhất (**LCM**) có thể quy về tính GCD với công thức đơn giản:

$$\text{lcm}(a, b) = \frac{a \cdot b}{\gcd(a, b)}$$

Do đó, LCM có thể được tính bằng thuật toán Euclid với cùng độ phức tạp thời gian:

Một cài đặt tránh tràn số nguyên bằng cách chia $a$ cho GCD trước:

```cpp
int lcm (int a, int b) {
    return a / gcd(a, b) * b;
}
```

## GCD nhị phân (Binary GCD)

Thuật toán GCD nhị phân là một tối ưu hóa cho thuật toán Euclid thông thường.

Phần chậm của thuật toán thông thường là phép chia lấy dư (modulo). Dù phép modulo là $O(1)$, nhưng thực tế nó chậm hơn nhiều so với các phép cộng, trừ hoặc phép toán bit. Vì vậy, sẽ tốt hơn nếu tránh được phép modulo.

Thật ra, bạn có thể thiết kế một thuật toán GCD nhanh mà không cần phép modulo, dựa trên các tính chất sau:

* Nếu cả hai số đều chẵn, ta có thể tách 2 ra khỏi cả hai và tính GCD của phần còn lại: $\gcd(2a, 2b) = 2 \gcd(a, b)$.
* Nếu một số chẵn, một số lẻ, ta bỏ 2 khỏi số chẵn: $\gcd(2a, b) = \gcd(a, b)$ nếu $b$ lẻ.
* Nếu cả hai số lẻ, trừ một số cho số kia không làm thay đổi GCD: $\gcd(a, b) = \gcd(b, a-b)$

Chỉ dùng các tính chất này và một số hàm bit nhanh của GCC, ta có thể cài đặt một phiên bản nhanh:

```cpp
int gcd(int a, int b) {
    if (!a || !b)
        return a | b;
    unsigned shift = __builtin_ctz(a | b);
    a >>= __builtin_ctz(a);
    do {
        b >>= __builtin_ctz(b);
        if (a > b)
            swap(a, b);
        b -= a;
    } while (b);
    return a << shift;
}
```

Lưu ý: Tối ưu hóa này thường không cần thiết, hầu hết các ngôn ngữ lập trình đều đã có hàm GCD trong thư viện chuẩn. Ví dụ, C++17 có hàm `std::gcd` trong header `numeric`.

## Bài tập thực hành

* CSAcademy - Greatest Common Divisor
* Codeforces 1916B - Two Divisors

Nguồn: [cp-algorithms.com](https://cp-algorithms.com/algebra/euclid-algorithm.html)